import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
  ValidateNested,
  Matches
} from 'class-validator';
import { Type } from 'class-transformer';
import { ImageType } from '../entities/adoption-center-images.entity';

export enum SupportedSpecies {
  PERROS = 'perros',
  GATOS = 'gatos',
  AVES = 'aves',
  CONEJOS = 'conejos',
  CABALLOS = 'caballos',
  OTROS = 'otros'
}

// Nuevo DTO para cada día individual
class DayScheduleDto {
  @IsEnum(['open', 'closed', 'appointment'], {
    message: 'El tipo debe ser open, closed o appointment'
  })
  type: 'open' | 'closed' | 'appointment';

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: 'Formato de hora de apertura inválido (HH:mm)' })
  openTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, { message: 'Formato de hora de cierre inválido (HH:mm)' })
  closeTime?: string;
}

class OpeningHoursDto {
  @ValidateNested() @Type(() => DayScheduleDto) monday: DayScheduleDto;
  @ValidateNested() @Type(() => DayScheduleDto) tuesday: DayScheduleDto;
  @ValidateNested() @Type(() => DayScheduleDto) wednesday: DayScheduleDto;
  @ValidateNested() @Type(() => DayScheduleDto) thursday: DayScheduleDto;
  @ValidateNested() @Type(() => DayScheduleDto) friday: DayScheduleDto;
  @ValidateNested() @Type(() => DayScheduleDto) saturday: DayScheduleDto;
  @ValidateNested() @Type(() => DayScheduleDto) sunday: DayScheduleDto;
}

class SocialLinksDto {
  @IsOptional() @IsUrl() facebook?: string;
  @IsOptional() @IsUrl() instagram?: string;
  @IsOptional() @IsUrl() twitter?: string;
  @IsOptional() @IsUrl() website?: string;
}

class LegalInfoDto {
  @IsString() taxId: string;
  @IsString() legalName: string;
  @IsOptional() @IsString() foundationDate?: string;
}

class DonationInfoDto {
  @IsOptional() @IsString() paypal?: string;
  @IsOptional() @IsString() bankAccount?: string;
  @IsOptional() @IsUrl() wishlist?: string;
}

class CreateAdoptionCenterImageDto {
  @IsString() @IsUrl() url: string;
  @IsEnum(ImageType) @IsOptional() type?: ImageType;
}

export class CreateAdoptionCenterDto {
  @IsString() @MinLength(3) name: string;
  @IsString() @IsOptional() organizationCode: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() slug: string;
  @IsString() address: string;
  @IsString() city: string;
  @IsString() zipCode: string;
  @IsString() country: string;
  @IsNumber() @IsOptional() lat?: number;
  @IsNumber() @IsOptional() lng?: number;
  @IsString() phone: string;
  @IsEmail() email: string;
  @IsString() managerName: string;

  @IsOptional() @ValidateNested() @Type(() => SocialLinksDto) socialLinks?: SocialLinksDto;

  // Actualizado: Ahora es obligatorio validar la estructura de horarios si se envía
  @IsOptional() @ValidateNested() @Type(() => OpeningHoursDto) openingHours?: OpeningHoursDto;

  @IsOptional() @ValidateNested() @Type(() => LegalInfoDto) legalInfo?: LegalInfoDto;
  @IsOptional() @ValidateNested() @Type(() => DonationInfoDto) donationInfo?: DonationInfoDto;

  @IsNotEmpty() @IsEnum(SupportedSpecies, { each: true }) supportedSpecies: SupportedSpecies[];
  @IsNumber() @IsOptional() capacity: number;
  @IsArray() @IsOptional() tags: string[]
  @IsInt() currentOccupancy: number;
  @IsBoolean() @IsOptional() hasVeterinaryService: boolean;
  @IsBoolean() @IsOptional() hasTransportService: boolean;
  @IsBoolean() @IsOptional() allowsVolunteers: boolean;
  @IsString() @IsOptional() adoptionPolicy?: string;
  @IsBoolean() @IsOptional() isActive: boolean;
  @IsBoolean() @IsOptional() isVerified?: boolean;
  @IsBoolean() @IsOptional() isEmergency: boolean;
  @IsNumber() @IsOptional() likesCount: number;

  @IsArray() @IsOptional() @ValidateNested({ each: true }) @Type(() => CreateAdoptionCenterImageDto)
  images?: CreateAdoptionCenterImageDto[];
}