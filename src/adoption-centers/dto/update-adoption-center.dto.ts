import { PartialType } from '@nestjs/swagger';
import { CreateAdoptionCenterDto } from './create-adoption-center.dto';

export class UpdateAdoptionCenterDto extends PartialType(CreateAdoptionCenterDto) {}