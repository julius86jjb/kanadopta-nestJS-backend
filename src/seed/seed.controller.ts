import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  /**
   * Endpoint principal para ejecutar la semilla.
   * Acceso: GET http://localhost:3000/api/seed
   */
  @Get()
  executeSeed() {
    return this.seedService.runSeed();
  }
}