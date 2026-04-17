import { 
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { isUUID } from 'class-validator';

import { CreateAdoptionCenterDto } from './dto/create-adoption-center.dto';
import { UpdateAdoptionCenterDto } from './dto/update-adoption-center.dto';
import { AdoptionCenter } from './entities/adoption-center.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { AdoptionCenterImage, ImageType } from './entities/adoption-center-images.entity';
import { GeocodingService } from 'src/common/services/geocoding.service';
import { User } from 'src/users/entities/user.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class AdoptionCentersService {

  private readonly logger = new Logger('AdoptionCentersService');

  constructor(
    @InjectRepository(AdoptionCenterImage)
    private readonly adoptionCenterImageRepository: Repository<AdoptionCenterImage>,

    @InjectRepository(AdoptionCenter)
    private readonly adoptionCenterRepository: Repository<AdoptionCenter>,

    private readonly geocodingService: GeocodingService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly dataSource: DataSource,
  ) { }

  async toggleLike(id: string) {
    await this.findOne(id);
    await this.adoptionCenterRepository.increment({ id }, 'likesCount', 1);
    const updatedCenter = await this.adoptionCenterRepository.findOneBy({ id });
    return { likesCount: updatedCenter.likesCount };
  }

  async create(
    createAdoptionCenterDto: CreateAdoptionCenterDto, 
    user: User,
    files?: { logo?: Express.Multer.File[], featured?: Express.Multer.File[], gallery?: Express.Multer.File[] }
  ) {
    try {
      const { images: _, ...centerDetails } = createAdoptionCenterDto;
      const { address, city, zipCode, name } = centerDetails;

      if (!centerDetails.organizationCode) {
        centerDetails.organizationCode = await this.generateOrganizationCode(name);
      }

      const coords = await this.geocodingService.getCoordinates(address, city, zipCode);
      if (!coords) throw new BadRequestException(`No se pudo localizar la dirección.`);

      const imageEntities: AdoptionCenterImage[] = [];

      if (files) {
        if (files.logo?.[0]) {
          const res = await this.cloudinaryService.uploadFile(files.logo[0], 'adoption-centers/logos');
          imageEntities.push(this.adoptionCenterImageRepository.create({
            url: res.secure_url,
            publicId: res.public_id,
            type: ImageType.LOGO
          }));
        }

        if (files.featured?.[0]) {
          const res = await this.cloudinaryService.uploadFile(files.featured[0], 'adoption-centers/featured');
          imageEntities.push(this.adoptionCenterImageRepository.create({
            url: res.secure_url,
            publicId: res.public_id,
            type: ImageType.FEATURED
          }));
        }

        if (files.gallery) {
          for (const file of files.gallery) {
            const res = await this.cloudinaryService.uploadFile(file, 'adoption-centers/gallery');
            imageEntities.push(this.adoptionCenterImageRepository.create({
              url: res.secure_url,
              publicId: res.public_id,
              type: ImageType.GALLERY
            }));
          }
        }
      }

      const center = this.adoptionCenterRepository.create({
        ...centerDetails,
        lat: coords.lat,
        lng: coords.lng,
        images: imageEntities,
        user,
        isVerified: createAdoptionCenterDto.isVerified ?? false,
        likesCount: 0
      });

      await this.adoptionCenterRepository.save(center);
      return this.findOnePlain(center.id);

    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.handleDBExceptions(error);
    }
  }

  async update(
    id: string, 
    updateAdoptionCenterDto: UpdateAdoptionCenterDto, 
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
    const center = await this.adoptionCenterRepository.preload({ id, ...toUpdate });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (files && (files.logo || files.featured || files.gallery)) {
        const typesToReplace: ImageType[] = [];
        if (files.logo) typesToReplace.push(ImageType.LOGO);
        if (files.featured) typesToReplace.push(ImageType.FEATURED);
        if (files.gallery) typesToReplace.push(ImageType.GALLERY);

        const oldImages = await this.adoptionCenterImageRepository.find({
          where: { 
            adoptionCenter: { id },
            type: In(typesToReplace) 
          }
        });

        const deletePromises = oldImages
          .filter(img => img.publicId)
          .map(img => this.cloudinaryService.deleteFile(img.publicId));
        await Promise.all(deletePromises);

        if (oldImages.length > 0) {
          await queryRunner.manager.remove(oldImages);
        }

        const newImages: AdoptionCenterImage[] = [];
        
        if (files.logo?.[0]) {
          const res = await this.cloudinaryService.uploadFile(files.logo[0], 'adoption-centers/logos');
          newImages.push(this.adoptionCenterImageRepository.create({ url: res.secure_url, publicId: res.public_id, type: ImageType.LOGO }));
        }

        if (files.featured?.[0]) {
          const res = await this.cloudinaryService.uploadFile(files.featured[0], 'adoption-centers/featured');
          newImages.push(this.adoptionCenterImageRepository.create({ url: res.secure_url, publicId: res.public_id, type: ImageType.FEATURED }));
        }

        if (files.gallery) {
          for (const file of files.gallery) {
            const res = await this.cloudinaryService.uploadFile(file, 'adoption-centers/gallery');
            newImages.push(this.adoptionCenterImageRepository.create({ url: res.secure_url, publicId: res.public_id, type: ImageType.GALLERY }));
          }
        }
        
        const imagesToKeep = centerDB.images.filter(img => !typesToReplace.includes(img.type));
        center.images = [...imagesToKeep, ...newImages];
      }

      await queryRunner.manager.save(center);
      await queryRunner.commitTransaction();
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBExceptions(error);
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string, user: User) {
    const center = await this.findOne(id);
    const isAdmin = (user.roles as string[]).includes('admin');
    const isOwner = center.user.id === user.id;

    if (!isAdmin) {
      if (!isOwner) throw new ForbiddenException('No tienes permiso para realizar esta acción.');
      
      // Soft Delete para el usuario común
      center.isActive = false;
      await this.adoptionCenterRepository.save(center);
      return { 
        message: 'Desactivación completada. El centro ya no es visible públicamente.',
        status: 'inactive' 
      };
    }

    // Hard Delete para el Administrador
    try {
      const publicIds = center.images
        ?.filter(img => img.publicId)
        .map(img => img.publicId) || [];

      if (publicIds.length > 0) {
        await Promise.all(
          publicIds.map(pubId => this.cloudinaryService.deleteFile(pubId))
        );
      }

      await this.adoptionCenterRepository.remove(center);
      return { 
        message: 'Centro y archivos multimedia eliminados permanentemente por el administrador.', 
        deleted: true 
      };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async deleteAllAdoptionCenters() {
    const query = this.adoptionCenterRepository.createQueryBuilder('center');
    try {
      return await query.delete().where({}).execute();
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const [centers, totalCenters] = await this.adoptionCenterRepository.findAndCount({
      take: limit, skip: offset,
      where: { isActive: true, isVerified: true },
      relations: { images: true },
      order: { likesCount: 'DESC' }
    });
    return { count: totalCenters, centers: centers.map(c => this.mapCenterImages(c)) };
  }

  async findAllAdmin(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const [centers, totalCenters] = await this.adoptionCenterRepository.findAndCount({
      take: limit, skip: offset,
      relations: { images: true, user: true },
      order: { createdAt: 'DESC' }
    });
    return { count: totalCenters, centers: centers.map(c => this.mapCenterImages(c)) };
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

  async uploadImage(file: Express.Multer.File, type: ImageType) {
    const res = await this.cloudinaryService.uploadFile(file, 'adoption-centers');
    return { url: res.secure_url, type, publicId: res.public_id };
  }

  private async generateOrganizationCode(name: string): Promise<string> {
    const prefix = name.substring(0, 3).toUpperCase().padEnd(3, 'X');
    const count = await this.adoptionCenterRepository.count({
        where: { organizationCode: prefix }
    });
    return `${prefix}-${(count + 1).toString().padStart(3, '0')}`;
  }

  private handleDBExceptions(error: any) {
    if (error.code === '23505') throw new BadRequestException('Datos duplicados');
    this.logger.error(error);
    throw new InternalServerErrorException('Error de servidor');
  }
}