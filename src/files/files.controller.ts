import { Controller, Get, Post, Param, UploadedFile, UploadedFiles, UseInterceptors, BadRequestException, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';
import { fileNamer } from './helpers/fileNamer.helper';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Get('adoption-center/:imageName')
  findAdoptionCenterImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticAdoptionCenterImage(imageName);
    res.sendFile(path);
  }

  // Subida de una sola imagen (Logo o Portada)
  @Post('adoption-center/single')
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/adoption-centers',
      filename: fileNamer
    })
  }))
  uploadSingleImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Make sure that the file is an image');

    const secureUrl = `${this.configService.get('HOST_API')}/files/adoption-center/${file.filename}`;
    return { secureUrl };
  }

  // Subida de múltiples imágenes (Galería)
  @Post('adoption-center/multiple')
  @UseInterceptors(FilesInterceptor('files', 10, {
    fileFilter: fileFilter,
    storage: diskStorage({
      destination: './static/adoption-centers',
      filename: fileNamer
    })
  }))
  uploadMultipleImages(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Make sure that you provide images');
    }

    const secureUrls = files.map(file => 
      `${this.configService.get('HOST_API')}/files/adoption-center/${file.filename}`
    );
    
    return { secureUrls };
  }
}