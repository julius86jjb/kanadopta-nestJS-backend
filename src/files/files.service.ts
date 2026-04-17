import { existsSync } from 'fs';
import { join } from 'path';
import { Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class FilesService {
  
  getStaticAdoptionCenterImage(imageName: string) {
    // La ruta base es la misma para cualquier imagen guardada en esta carpeta
    const path = join(__dirname, '../../static/adoption-centers', imageName);

    if (!existsSync(path)) {
      throw new BadRequestException(`No se encontró la imagen ${imageName} del centro de adopción`);
    }

    return path;
  }
}