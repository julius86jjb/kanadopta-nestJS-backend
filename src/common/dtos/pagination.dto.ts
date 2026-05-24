import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min, IsString } from "class-validator";

export class PaginationDto {
    @IsOptional()
    @IsPositive() 
    @Type(() => Number) 
    limit?: number;

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    @Min(0)
    offset?: number;

    @IsOptional()
    @IsString()
    search?: string;
}
