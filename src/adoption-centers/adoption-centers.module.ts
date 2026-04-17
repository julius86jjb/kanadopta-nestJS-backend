import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config'; // <--- Añadido para el GeocodingService

import { AdoptionCentersService } from './adoption-centers.service';
import { AdoptionCentersController } from './adoption-centers.controller';
import { AdoptionCenter } from './entities/adoption-center.entity';
import { AdoptionCenterImage } from './entities/adoption-center-images.entity';

import { GeocodingService } from 'src/common/services/geocoding.service';
import { AuthModule } from 'src/users/auth/auth.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  controllers: [AdoptionCentersController],
  providers: [
    AdoptionCentersService,
    GeocodingService
  ],
  imports: [
    ConfigModule, // <--- Importante: permite inyectar ConfigService en GeocodingService
    HttpModule,
    AuthModule,
    TypeOrmModule.forFeature([AdoptionCenter, AdoptionCenterImage]),
    CloudinaryModule
  ],
  exports: [
    TypeOrmModule,
    AdoptionCentersService
  ]
})
export class AdoptionCentersModule { }