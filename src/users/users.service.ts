import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './auth/dto/create-user.dto';
import { UpdateUserDto } from './auth/dto/update-user.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { HandleExceptionsService } from '../common/services/handle-exceptions.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly handleExceptionsService: HandleExceptionsService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return user;
    } catch (error) {
      this.handleExceptionsService.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const users = await this.userRepository.find({
      take: limit,
      skip: offset,
    });

    const totalUsers = await this.userRepository.count();

    return {
      count: totalUsers,
      pages: Math.ceil(totalUsers / limit),
      users: users.map((user) => {
        delete user.password;
        return user;
      }),
    };
  }

  async findAllDeleted(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    // Buscamos usuarios en la papelera
    const deletedUsers = await this.userRepository.find({
      where: { 
        deleted_at: Not(IsNull()) 
      },
      withDeleted: true,
      take: limit,
      skip: offset,
    });

    // Contamos cuántos usuarios hay en la papelera
    const totalDeletedUsers = await this.userRepository.count({
      where: { deleted_at: Not(IsNull()) },
      withDeleted: true
    });

    return {
      count: totalDeletedUsers,
      pages: Math.ceil(totalDeletedUsers / limit),
      users: deletedUsers.map((user) => {
        delete user.password;
        return user;
      }),
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }
    
    delete user.password;
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with id: ${id} not found`);

    const updatedUser = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });

    try {
      if (updateUserDto.password) {
        updatedUser.password = bcrypt.hashSync(updateUserDto.password, 10);
      }

      await this.userRepository.save(updatedUser);
      delete updatedUser.password;
      return updatedUser;
      
    } catch (error) {
      this.handleExceptionsService.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await this.userRepository.softRemove(user);
    return { message: 'User deleted successfully' };
  }

  async restore(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true
    });

    if (!user) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    if (!user.deleted_at) {
      throw new BadRequestException(`User with id: ${id} is already active`);
    }

    await this.userRepository.restore(id);
    return { message: 'User restored successfully' };
  }

  async deleteAllUsers() {
    const query = this.userRepository.createQueryBuilder('user');

    try {
      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.handleExceptionsService.handleDBExceptions(error);
    }
  }
}