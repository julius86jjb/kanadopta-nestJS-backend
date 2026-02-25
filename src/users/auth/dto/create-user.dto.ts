import {
  IsString,
  IsEmail,
  IsBoolean,
  MaxLength,
  Matches,
  MinLength,
  IsOptional,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { ValidRoles } from '../interfaces/valid-roles.interface';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @IsString()
  @MinLength(5)
  userName: string;

  @IsString()
  @MinLength(1)
  first_name: string;

  @IsString()
  @MinLength(1)
  last_name: string;

  @IsString()
  country: string;

  @IsString()
  city: string;

  @IsString()
  @MinLength(5)
  address: string;

  @IsArray()
  @IsOptional()
  @IsEnum(ValidRoles, { each: true })
  roles?: ValidRoles[];
  
  @IsString()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  img?: string;
}
