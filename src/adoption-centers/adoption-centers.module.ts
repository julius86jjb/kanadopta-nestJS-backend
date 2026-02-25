import { Module } from '@nestjs/common';
import { AdoptionCentersService } from './adoption-centers.service';
import { AdoptionCentersController } from './adoption-centers.controller';

@Module({
  controllers: [AdoptionCentersController],
  providers: [AdoptionCentersService],
})
export class AdoptionCentersModule {}
