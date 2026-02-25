import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdoptionCentersService } from './adoption-centers.service';
import { CreateAdoptionCenterDto } from './dto/create-adoption-center.dto';
import { UpdateAdoptionCenterDto } from './dto/update-adoption-center.dto';

@Controller('adoption-centers')
export class AdoptionCentersController {
  constructor(private readonly adoptionCentersService: AdoptionCentersService) {}

  @Post()
  create(@Body() createAdoptionCenterDto: CreateAdoptionCenterDto) {
    return this.adoptionCentersService.create(createAdoptionCenterDto);
  }

  @Get()
  findAll() {
    return this.adoptionCentersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adoptionCentersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdoptionCenterDto: UpdateAdoptionCenterDto) {
    return this.adoptionCentersService.update(+id, updateAdoptionCenterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adoptionCentersService.remove(+id);
  }
}
