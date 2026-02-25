import {
  Injectable,
  Logger,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HandleExceptionsService } from 'src/common/services/handle-exceptions.service';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './auth/dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private handleExceptionsService: HandleExceptionsService,
  ) { }

  findAll() {
    return this.userRepository.find({})
  }

  async findOne(id: string) {
    const store = await this.userRepository.findOneBy({ id })
    if (!store)
      throw new NotFoundException(`User with id: ${id} not found`)

    return store;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });

    if (!user) throw new NotFoundException(`user with id: ${id} not found`);

    try {
      if (user.password === undefined) {
        await this.userRepository.save({ ...user });
      } else {
        const { password, ...userData } = user

        await this.userRepository.save({
          ...userData,
          password: bcrypt.hashSync(password, 10)
        });

      }
      delete user.password;
      return user;
    } catch (error) {
      this.handleExceptionsService.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id)
    await this.userRepository.remove(user);
  }


  async deleteAllUsers() {
    const query = this.userRepository.createQueryBuilder('user')

    try {
      return await query
        .delete()
        .where({})
        .execute()
    } catch (error) {
      this.handleExceptionsService.handleDBExceptions(error);
    }
  }
}
