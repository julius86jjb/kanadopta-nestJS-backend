import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

import { UsersModule } from '../users/users.module';
import { AuthModule } from '../users/auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    UsersModule, 
    AuthModule
  ]
})
export class SeedModule { }
