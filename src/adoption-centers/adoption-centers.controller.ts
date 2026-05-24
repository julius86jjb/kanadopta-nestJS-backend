import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query, 
  ParseUUIDPipe, 
  UseInterceptors, 
  UploadedFiles, 
  BadRequestException 
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { AdoptionCentersService } from './adoption-centers.service';
import { CreateAdoptionCenterDto } from './dto/create-adoption-center.dto';
import { UpdateAdoptionCenterDto } from './dto/update-adoption-center.dto';

import { Auth } from 'src/users/auth/decorators/auth.decorator';
import { GetUser } from 'src/users/auth/decorators/get-user.decorator';
import { ValidRoles } from 'src/users/auth/interfaces/valid-roles.interface';
import { User } from 'src/users/entities/user.entity'; 
import { ImageType } from './entities/adoption-center-images.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('adoption-centers')
export class AdoptionCentersController {
  constructor(private readonly adoptionCentersService: AdoptionCentersService) { }

  @Patch('like/:id')
  toggleLike(@Param('id', ParseUUIDPipe) id: string) {
    return this.adoptionCentersService.toggleLike(id);
  }

  @Post()
  @Auth(ValidRoles.admin)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'logo', maxCount: 1 },
    { name: 'featured', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ], {
    limits: { fileSize: 1024 * 1024 * 6 },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
        return callback(new BadRequestException('Solo se permiten imágenes'), false);
      }
      callback(null, true);
    }
  }))
  async create(
    @UploadedFiles() files: { 
      logo?: Express.Multer.File[], 
      featured?: Express.Multer.File[], 
      gallery?: Express.Multer.File[] 
    },
    @Body('data') data: string,
    @GetUser() user: User,
  ) {
    let createDto: CreateAdoptionCenterDto;
    try {
      createDto = JSON.parse(data);
    } catch (error) {
      throw new BadRequestException('El formato del campo "data" no es un JSON válido');
    }
    return this.adoptionCentersService.create(createDto, user, files);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'logo', maxCount: 1 },
    { name: 'featured', maxCount: 1 },
    { name: 'gallery', maxCount: 10 },
  ], {
    limits: { fileSize: 1024 * 1024 * 6 },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
        return callback(new BadRequestException('Solo se permiten imágenes'), false);
      }
      callback(null, true);
    }
  }))
  async update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body('data') data: string, 
    @UploadedFiles() files: { 
      logo?: Express.Multer.File[], 
      featured?: Express.Multer.File[], 
      gallery?: Express.Multer.File[] 
    },
    @GetUser() user: User
  ) {
    let updateDto: any = {}; 
    if (data) {
      try {
        updateDto = JSON.parse(data);
      } catch (error) {
        throw new BadRequestException('El formato del campo "data" no es un JSON válido');
      }
    }
    return this.adoptionCentersService.update(id, updateDto, user, files);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.adoptionCentersService.remove(id);
  }

  @Post('upload-image')
  @Auth(ValidRoles.admin)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'file', maxCount: 10 },
  ], {
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
        return callback(new BadRequestException('Solo se permiten imágenes'), false);
      }
      callback(null, true);
    }
  }))
  async uploadImage(
    @Body('type') type: string,
    @UploadedFiles() files: { file?: Express.Multer.File[] },
  ) {
    if (!type || !Object.values(ImageType).includes(type as ImageType)) {
      throw new BadRequestException(`El campo 'type' debe ser: ${Object.values(ImageType).join(', ')}`);
    }

    if (!files.file || files.file.length === 0) {
      throw new BadRequestException('Debe subir al menos un archivo');
    }

    const uploadPromises = files.file.map((file) =>
      this.adoptionCentersService.uploadImage(file, type as ImageType)
    );

    return await Promise.all(uploadPromises);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.adoptionCentersService.findAll(paginationDto, false);
  }

  @Get('admin')
  // @Auth(ValidRoles.admin) 
  findAllForAdmin(@Query() paginationDto: PaginationDto) {
    return this.adoptionCentersService.findAll(paginationDto, true); 
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.adoptionCentersService.findOnePlain(term);
  }
}