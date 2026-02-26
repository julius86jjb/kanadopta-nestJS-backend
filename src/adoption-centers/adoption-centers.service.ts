import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateAdoptionCenterDto } from './dto/create-adoption-center.dto';
import { UpdateAdoptionCenterDto } from './dto/update-adoption-center.dto';
import { AdoptionCenter } from './entities/adoption-center.entity';
import { isUUID } from 'class-validator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class AdoptionCentersService {

  // Logger para rastrear errores en la consola de Nest de forma limpia
  private readonly logger = new Logger('AdoptionCentersService');

  constructor(
    @InjectRepository(AdoptionCenter)
    private readonly adoptionCenterRepository: Repository<AdoptionCenter>,
  ) { }

  async create(createAdoptionCenterDto: CreateAdoptionCenterDto) {
    try {
      // 1. Creamos la instancia de la entidad con los datos del DTO
      // Nota: Aquí TypeORM mapea los campos, incluidos los simple-json
      const center = this.adoptionCenterRepository.create(createAdoptionCenterDto);

      // 2. Guardamos en la base de datos
      // Al salvar, se ejecutan automáticamente los @BeforeInsert (UUID y Slug)
      await this.adoptionCenterRepository.save(center);

      // 3. Devolvemos el centro creado con sus IDs y Slugs generados
      return center;

    } catch (error) {
      // 4. Gestión centralizada de errores
      this.handleDBExceptions(error);
    }
  }

  // Métodos pendientes de implementar (findAll, findOne, etc.)
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
      const centers = await this.adoptionCenterRepository.find({
        take: limit,
        skip: offset,
        // En el futuro aquí añadiremos: relations: { animals: true }
      });

      // Mapeo opcional: Si quieres que los centros salgan "aplanados" 
      // como en el findOnePlain, podrías usar un .map() aquí también.
      return centers;

    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findOne(term: string) {
    let center: AdoptionCenter;

    if (isUUID(term)) {
      center = await this.adoptionCenterRepository.findOneBy({ id: term });
    } else {

      const searchTerm = term.toLowerCase().replaceAll('-', '_');

      const queryBuilder = this.adoptionCenterRepository.createQueryBuilder('center');

      center = await queryBuilder
        .where('UPPER(name) = :name OR slug = :slug OR UPPER("organizationCode") = :orgCode', {
          name: term.toUpperCase(),
          slug: searchTerm,
          orgCode: term.toUpperCase()
        })
        .getOne();
    }

    if (!center)
      throw new NotFoundException(`Adoption Center with term ${term} not found`);

    return center;
  }

  async findOnePlain(term: string) {
    const center = await this.findOne(term);

    // Aquí devolvemos el objeto. Cuando tengas imágenes, 
    // haremos el .map() igual que Fernando.
    return {
      ...center,
      // images: center.images.map(img => img.url) // Se activará en el futuro
    };
  }



  async update(id: string, updateAdoptionCenterDto: UpdateAdoptionCenterDto) {

    // 1. El preload busca por ID y carga los cambios del DTO (que solo traerá el nombre, etc.)
    const center = await this.adoptionCenterRepository.preload({
      id: id,
      ...updateAdoptionCenterDto,
    });

    if (!center) throw new NotFoundException(`No se encontró el centro con ID: ${id}`);

    try {
      // 2. Al salvar, se dispara el @BeforeUpdate y actualiza el slug basándose en el nombre
      await this.adoptionCenterRepository.save(center);

      // 3. Devolvemos la respuesta estructurada
      return {
        message: `El centro "${center.name}" se ha actualizado correctamente.`,
        updated: true,
        data: center
      };

    } catch (error) {
      // Si el nuevo slug ya existe en otro centro, aquí saltará el error de duplicado
      this.handleDBExceptions(error);
    }
  }



  async remove(id: string) {
    // 1. Buscamos el centro (aquí ya tenemos los datos en la constante 'center')
    const center = await this.findOne(id);

    // 2. Lo borramos de la base de datos de Postgres
    await this.adoptionCenterRepository.remove(center);

    // 3. Devolvemos un objeto con el mensaje y la información que tenía el centro
    return {
      message: `El centro "${center.name}" ha sido eliminado correctamente`,
      deleted: true,
      data: center // Aquí viaja el objeto completo que acabas de borrar
    };
  }



  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      // Aquí puedes personalizar el mensaje para que no sea tan técnico
      throw new BadRequestException('Ya existe un centro de adopción con esos datos (nombre, email o código duplicado)');
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}