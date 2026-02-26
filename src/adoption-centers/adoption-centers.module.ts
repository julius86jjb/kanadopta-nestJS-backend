import { Module } from '@nestjs/common';
import { AdoptionCentersService } from './adoption-centers.service';
import { AdoptionCentersController } from './adoption-centers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdoptionCenter } from './entities/adoption-center.entity';

@Module({
  controllers: [AdoptionCentersController],
  providers: [AdoptionCentersService],
  imports:[
    TypeOrmModule.forFeature([AdoptionCenter])
  ]
})
export class AdoptionCentersModule {}
