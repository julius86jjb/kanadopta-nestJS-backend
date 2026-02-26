import { ApiProperty } from "@nestjs/swagger";
import { 
    IsString, MinLength, IsNumber, IsPositive, IsOptional, 
    IsInt, IsArray, IsEmail, IsObject, IsBoolean, IsUrl 
} from "class-validator";
import { DonationInfo } from "../interfaces/donation-info.interface";
import { LegalInfo } from "../interfaces/legal-info.interface";
import { OpeningHours } from "../interfaces/opening-hours.interface";
import { SocialLinks } from "../interfaces/social-links.interface";


export class CreateAdoptionCenterDto {

    @ApiProperty({ description: 'Nombre oficial del centro de adopción' })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({ description: 'Código único de registro de la organización' })
    @IsString()
    organizationCode: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    description?: string;

    // --- Ubicación (Obligatoria para el mapa) ---
    @ApiProperty()
    @IsString()
    address: string;

    @ApiProperty()
    @IsString()
    city: string;

    @ApiProperty()
    @IsString()
    zipCode: string;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    lat?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    lng?: number;

    // --- Contacto (Vital para la adopción) ---
    @ApiProperty()
    @IsString()
    phone: string;

    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    managerName?: string;

    // --- Información Modular (Opcional por lógica de negocio) ---
    @ApiProperty({ required: false })
    @IsObject()
    @IsOptional()
    socialLinks?: SocialLinks;

    @ApiProperty({ required: false })
    @IsObject()
    @IsOptional()
    legalInfo?: LegalInfo;

    @ApiProperty({ required: false })
    @IsObject()
    @IsOptional()
    donationInfo?: DonationInfo;

    @ApiProperty({ required: false })
    @IsObject()
    @IsOptional()
    hours?: OpeningHours;

    // --- Capacidades y Tags ---
    @ApiProperty({ required: false })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    supportedSpecies?: string[];

    @ApiProperty({ required: false })
    @IsInt()
    @IsPositive()
    @IsOptional()
    capacity?: number;

    @ApiProperty({ required: false })
    @IsInt()
    @IsOptional()
    currentOccupancy?: number;

    @ApiProperty({ required: false })
    @IsNumber()
    @IsOptional()
    monthlyOperatingCost?: number;

    @ApiProperty({ required: false, description: 'Palabras clave para búsqueda' })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags?: string[];

    @ApiProperty({ required: false })
    @IsUrl()
    @IsOptional()
    mainImage?: string;

    @ApiProperty({ required: false, default: false })
    @IsBoolean()
    @IsOptional()
    isEmergency?: boolean;
}