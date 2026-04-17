import { Injectable, Logger } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { AdoptionCentersService } from 'src/adoption-centers/adoption-centers.service';
import { User } from 'src/users/entities/user.entity';
import { initialData } from './data/seed-data';
import { CreateAdoptionCenterDto } from 'src/adoption-centers/dto/create-adoption-center.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/auth/dto/create-user.dto';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('SeedService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly adoptionCentersService: AdoptionCentersService,
    private readonly usersService: UsersService,
  ) { }

  async runSeed() {
    await this.deleteTables();
    const adminUser = await this.insertUsers();
    await this.insertNewCenters(adminUser);

    return 'SEED EXECUTED SUCCESSFULLY';
  }

  private async deleteTables() {
    await this.adoptionCentersService.deleteAllAdoptionCenters();
    await this.userRepository.createQueryBuilder().delete().where({}).execute();
  }

  private async insertUsers(): Promise<User> {
    const { users: seedUsers } = initialData;

    // Creamos todos los usuarios usando el servicio
    const createdUsers = [];
    for (const user of seedUsers) {
      // Al llamar al servicio, la contraseña se encripta y el email se normaliza
      const newUser = await this.usersService.create(user as CreateUserDto);
      createdUsers.push(newUser);
    }

    // Devolvemos el primero para que sea el Admin de los centros
    return createdUsers[0];
  }

  private async insertNewCenters(user: User) {
    const { centers } = initialData;

    for (const center of centers) {
      try {
        await this.adoptionCentersService.create(center as CreateAdoptionCenterDto, user);
      } catch (error) {
        this.logger.warn(`No se pudo crear el centro ${center.name}`);
      }
    }
  }
}