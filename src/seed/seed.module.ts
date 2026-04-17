import { Module } from '@nestjs/common';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AdoptionCentersModule } from '../adoption-centers/adoption-centers.module';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    // Importamos los módulos para que el SeedService 
    // pueda inyectar sus servicios correspondientes
    AdoptionCentersModule,
    UsersModule,
  ]
})
export class SeedModule {}