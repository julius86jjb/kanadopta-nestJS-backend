import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './auth/dto/create-user.dto';
import { UpdateUserDto } from './auth/dto/update-user.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth } from './auth/decorators/auth.decorator';
import { ValidRoles } from './auth/interfaces/valid-roles.interface';
import { CurrentUserGuard } from './auth/guards/current-user.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth(ValidRoles.admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Auth(ValidRoles.admin)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get('trash')
  @Auth(ValidRoles.admin)
  findAllDeleted(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAllDeleted(paginationDto);
  }

  @Get(':id')
  @UseGuards(CurrentUserGuard)
  @Auth()
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('restore/:id')
  @Auth(ValidRoles.admin)
  restore(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.restore(id);
  }

  @Patch(':id')
  @UseGuards(CurrentUserGuard)
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(CurrentUserGuard)
  @Auth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}