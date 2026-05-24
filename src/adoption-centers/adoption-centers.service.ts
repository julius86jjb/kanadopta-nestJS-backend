import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In, ILike, Brackets } from 'typeorm';
import { isUUID } from 'class-validator';
import { CreateAdoptionCenterDto } from './dto/create-adoption-center.dto';
import { UpdateAdoptionCenterDto } from './dto/update-adoption-center.dto';
import { AdoptionCenter } from './entities/adoption-center.entity';
import { AdoptionCenterImage, ImageType } from './entities/adoption-center-images.entity';
import { GeocodingService } from 'src/common/services/geocoding.service';
import { User } from 'src/users/entities/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class AdoptionCentersService {

  private readonly logger = new Logger('AdoptionCentersService');

  constructor(
    @InjectRepository(AdoptionCenterImage)
    private readonly adoptionCenterImageRepository: Repository<AdoptionCenterImage>,

    @InjectRepository(AdoptionCenter)
    private readonly adoptionCenterRepository: Repository<AdoptionCenter>,

    private readonly dataSource: DataSource,
    private readonly geocodingService: GeocodingService,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  async create(createAdoptionCenterDto: CreateAdoptionCenterDto, user: User, files?: { logo?: Express.Multer.File[], featured?: Express.Multer.File[], gallery?: Express.Multer.File[] }) {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const tempUploadedPublicIds: string[] = [];

    try {
      const { images: _, ...centerDetails } = createAdoptionCenterDto;
      // Extraemos los nuevos campos para la geocodificación
      const { address, city, province, state, zipCode, name } = centerDetails;

      if (!centerDetails.organizationCode) {
        centerDetails.organizationCode = await this.generateOrganizationCode(name);
      }

      // PASAMOS LOS NUEVOS CAMPOS AQUÍ
      const coords = await this.geocodingService.getCoordinates(address, city, province, state, zipCode);
      if (!coords) throw new BadRequestException(`No se pudo localizar la dirección.`);

      const center = this.adoptionCenterRepository.create({
        ...centerDetails,
        lat: coords.lat,
        lng: coords.lng,
        user,
        isVerified: createAdoptionCenterDto.isVerified ?? false,
        likesCount: 0,
        images: []
      });

      if (files) {
        const newImages: AdoptionCenterImage[] = [];

        if (files.logo?.[0]) {
          const res = await this.cloudinaryService.uploadFile(files.logo[0], 'adoption-centers/logos');
          tempUploadedPublicIds.push(res.public_id);
          newImages.push(this.adoptionCenterImageRepository.create({ url: res.secure_url, publicId: res.public_id, type: ImageType.LOGO }));
        }

        if (files.featured?.[0]) {
          const res = await this.cloudinaryService.uploadFile(files.featured[0], 'adoption-centers/featured');
          tempUploadedPublicIds.push(res.public_id);
          newImages.push(this.adoptionCenterImageRepository.create({ url: res.secure_url, publicId: res.public_id, type: ImageType.FEATURED }));
        }

        if (files.gallery) {
          for (const file of files.gallery) {
            const res = await this.cloudinaryService.uploadFile(file, 'adoption-centers/gallery');
            tempUploadedPublicIds.push(res.public_id);
            newImages.push(this.adoptionCenterImageRepository.create({ url: res.secure_url, publicId: res.public_id, type: ImageType.GALLERY }));
          }
        }
        center.images = newImages;
      }

      const savedCenter = await queryRunner.manager.save(center);
      await queryRunner.commitTransaction();
      return this.findOnePlain(savedCenter.id);

    } catch (error) {
      await queryRunner.rollbackTransaction();

      for (const publicId of tempUploadedPublicIds) {
        try {
          await this.cloudinaryService.deleteFile(publicId);
        } catch (cloudinaryError) {
          this.logger.error(`No se pudo borrar la imagen huérfana ${publicId} en el rollback:`, cloudinaryError);
        }
      }

      this.handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }

  async update(
    id: string,
    updateAdoptionCenterDto: UpdateAdoptionCenterDto | any,
    user: User,
    files?: { logo?: Express.Multer.File[], featured?: Express.Multer.File[], gallery?: Express.Multer.File[] }
  ) {
    const centerDB = await this.findOne(id);
    const isAdmin = (user.roles as string[]).includes('admin');
    const isOwner = centerDB.user.id === user.id;

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException(`No tienes permisos para editar este centro.`);
    }

    const { images: _, ...toUpdate } = updateAdoptionCenterDto;

    // 1. Pre-cargamos la entidad con los datos básicos del DTO
    const center = await this.adoptionCenterRepository.preload({ id, ...toUpdate });
    if (!center) throw new NotFoundException(`Centro con id ${id} no encontrado`);

    // 2. LÓGICA DE GEOLOCALIZACIÓN
    if (toUpdate.address || toUpdate.city || toUpdate.province || toUpdate.state || toUpdate.zipCode) {

      this.logger.log('Detectados campos de dirección. Iniciando geolocalización...'); // <-- AÑADE ESTO

      const address = toUpdate.address || centerDB.address;
      const city = toUpdate.city || centerDB.city;
      const province = toUpdate.province || centerDB.province;
      const state = toUpdate.state || centerDB.state;
      const zipCode = toUpdate.zipCode || centerDB.zipCode;

      const coords = await this.geocodingService.getCoordinates(address, city, province, state, zipCode);

      if (coords) {
        center.lat = coords.lat;
        center.lng = coords.lng;
        this.logger.log(`¡ÉXITO! Coordenadas obtenidas: ${coords.lat}, ${coords.lng}`);
      } else {
        this.logger.error(`¡FALLO! Nominatim no encontró nada para esta dirección.`);
      }
    }

    // 3. Manejo del Slug
    if (toUpdate.name) {
      center.slug = toUpdate.name
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, '-');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const tempUploadedPublicIds: string[] = [];

    try {
      const typesToClear: ImageType[] = [];

      // Lógica de limpieza de imágenes (se mantiene igual)
      if (files?.logo || updateAdoptionCenterDto.logo === null) typesToClear.push(ImageType.LOGO);
      if (files?.featured || updateAdoptionCenterDto.featured === null) typesToClear.push(ImageType.FEATURED);
      if (files?.gallery || updateAdoptionCenterDto.gallery === null) typesToClear.push(ImageType.GALLERY);

      if (typesToClear.length > 0) {
        const oldImages = await this.adoptionCenterImageRepository.find({
          where: { adoptionCenter: { id }, type: In(typesToClear) }
        });

        const deletePromises = oldImages
          .filter(img => img.publicId)
          .map(img => this.cloudinaryService.deleteFile(img.publicId));
        await Promise.all(deletePromises);

        if (oldImages.length > 0) {
          await queryRunner.manager.remove(oldImages);
        }
        center.images = centerDB.images.filter(img => !typesToClear.includes(img.type));
      }

      // Subida de nuevas imágenes
      const newImages: AdoptionCenterImage[] = [];
      if (files?.logo?.[0]) {
        const res = await this.cloudinaryService.uploadFile(files.logo[0], 'adoption-centers/logos');
        tempUploadedPublicIds.push(res.public_id);
        newImages.push(this.adoptionCenterImageRepository.create({ url: res.secure_url, publicId: res.public_id, type: ImageType.LOGO }));
      }
      if (files?.featured?.[0]) {
        const res = await this.cloudinaryService.uploadFile(files.featured[0], 'adoption-centers/featured');
        tempUploadedPublicIds.push(res.public_id);
        newImages.push(this.adoptionCenterImageRepository.create({ url: res.secure_url, publicId: res.public_id, type: ImageType.FEATURED }));
      }
      if (files?.gallery) {
        for (const file of files.gallery) {
          const res = await this.cloudinaryService.uploadFile(file, 'adoption-centers/gallery');
          tempUploadedPublicIds.push(res.public_id);
          newImages.push(this.adoptionCenterImageRepository.create({ url: res.secure_url, publicId: res.public_id, type: ImageType.GALLERY }));
        }
      }

      center.images = [...(center.images || centerDB.images), ...newImages];

      // GUARDADO FINAL
      await queryRunner.manager.save(center);
      await queryRunner.commitTransaction();

      return this.findOnePlain(id);

    } catch (error) {
      await queryRunner.rollbackTransaction();
      // Limpieza de Cloudinary en caso de error...
      this.handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }

async findAll(paginationDto: PaginationDto, isAdmin: boolean = false) {
    const { limit = 10, offset = 0, search } = paginationDto;

    const queryBuilder = this.adoptionCenterRepository.createQueryBuilder('center')
      .leftJoinAndSelect('center.images', 'images')
      .take(limit)
      .skip(offset)
      .orderBy('center.createdAt', 'DESC'); 

    if (isAdmin) {
      queryBuilder.leftJoinAndSelect('center.user', 'user');
    } else {
      queryBuilder.where('center.isActive = :active', { active: true });
    }

    if (search) {
      const s = search.trim(); // Ya no hace falta el toLowerCase() porque usamos ILIKE

      const isZipCode = /^\d{2,5}$/.test(s);
      let zipPrefix = '';

      if (isZipCode) {
        zipPrefix = s.substring(0, 3);
      }

      queryBuilder.andWhere(
        new Brackets((qb) => {
          // --- CAMPOS PÚBLICOS EXCLUSIVOS (Adoptante) ---
          qb.where('center.name ILIKE :search', { search: `%${s}%` })
            .orWhere('center.city ILIKE :search', { search: `%${s}%` })
            .orWhere('center.province ILIKE :search', { search: `%${s}%` });

          if (isZipCode) {
            qb.orWhere('center.zipCode LIKE :zipParam', { zipParam: `${zipPrefix}%` });
          } else {
            qb.orWhere('center.zipCode ILIKE :search', { search: `%${s}%` });
          }

          // --- CAMPOS EXTRA SÓLO PARA ADMINISTRACIÓN ---
          if (isAdmin) {
            qb.orWhere('center.state ILIKE :search', { search: `%${s}%` }) 
              .orWhere('center.address ILIKE :search', { search: `%${s}%` })
              .orWhere('center.email ILIKE :search', { search: `%${s}%` })
              .orWhere('center.managerName ILIKE :search', { search: `%${s}%` })
              .orWhere('center.phone ILIKE :search', { search: `%${s}%` })
              .orWhere('center.organizationCode ILIKE :search', { search: `%${s}%` })
              .orWhere('center.slug ILIKE :search', { search: `%${s}%` });

            if (s.toLowerCase() === 'activo') qb.orWhere('center.isActive = :active', { active: true });
            if (s.toLowerCase() === 'inactivo') qb.orWhere('center.isActive = :active', { active: false });
            if (s.toLowerCase() === 'verificado') qb.orWhere('center.isVerified = :verified', { verified: true });
            if (s.toLowerCase() === 'pendiente') qb.orWhere('center.isVerified = :verified', { verified: false });
          }
        }),
        {
          search: `%${s}%`,
          zipParam: `${zipPrefix}%`
        }
      );
    }

    const [centers, totalCenters] = await queryBuilder.getManyAndCount();

    return {
      count: totalCenters,
      pages: Math.ceil(totalCenters / limit),
      centers: centers.map(c => this.mapCenterImages(c))
    };
  }

  async findOne(term: string) {
    let center: AdoptionCenter;
    const relations = { images: true, user: true };
    if (isUUID(term)) {
      center = await this.adoptionCenterRepository.findOne({ where: { id: term }, relations });
    } else {
      center = await this.adoptionCenterRepository.findOne({ where: { slug: term.toLowerCase() }, relations });
    }
    if (!center) throw new NotFoundException('Centro no encontrado');
    return center;
  }

  async findOnePlain(term: string) {
    const center = await this.findOne(term);
    return this.mapCenterImages(center);
  }

  private mapCenterImages(center: AdoptionCenter) {
    return {
      ...center,
      images: center.images?.map(img => ({ url: img.url, type: img.type })) || []
    };
  }

  async remove(id: string) {
    const center = await this.findOne(id);
    try {
      if (center.images && center.images.length > 0) {
        const deletePromises = center.images
          .filter(img => img.publicId)
          .map(img => this.cloudinaryService.deleteFile(img.publicId));
        await Promise.all(deletePromises);
      }
      await this.adoptionCenterRepository.remove(center);
      return { deleted: true, id };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async toggleLike(id: string) {
    const center = await this.findOne(id);
    center.likesCount++;
    return await this.adoptionCenterRepository.save(center);
  }

  async uploadImage(file: Express.Multer.File, type: ImageType) {
    const res = await this.cloudinaryService.uploadFile(file, 'adoption-centers');
    return { url: res.secure_url, type, publicId: res.public_id };
  }

  private async generateOrganizationCode(name: string): Promise<string> {
    const prefix = name.substring(0, 3).toUpperCase().padEnd(3, 'X');
    const count = await this.adoptionCenterRepository.count({
      where: { organizationCode: ILike(`${prefix}-%`) }
    });
    return `${prefix}-${(count + 1).toString().padStart(3, '0')}`;
  }

  async deleteAllAdoptionCenters() {
    const query = this.adoptionCenterRepository.createQueryBuilder('center');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  private handleDBExceptions(error: any) {
    if (error instanceof BadRequestException || error instanceof ForbiddenException || error instanceof NotFoundException) {
      throw error;
    }

    if (error.code === '23505') {
      const specificMessage = error.detail || error.message || 'Ya existe un registro con esos datos duplicados.';
      throw new BadRequestException(specificMessage);
    }

    if (error.code === '22001') {
      throw new BadRequestException('Uno de los campos es demasiado largo para la base de datos.');
    }

    if (error.code === '23502') {
      throw new BadRequestException(`El campo '${error.column}' no puede estar vacío.`);
    }

    if (error.code === '22P02') {
      throw new BadRequestException('Formato de datos inválido en la petición.');
    }

    this.logger.error(error);
    throw new InternalServerErrorException(error.message || 'Error inesperado del servidor.');
  }
}
