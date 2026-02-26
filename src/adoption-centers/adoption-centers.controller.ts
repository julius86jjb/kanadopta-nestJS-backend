import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { AdoptionCentersService } from './adoption-centers.service';
import { CreateAdoptionCenterDto } from './dto/create-adoption-center.dto';
import { UpdateAdoptionCenterDto } from './dto/update-adoption-center.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Controller('adoption-centers')
export class AdoptionCentersController {
  constructor(private readonly adoptionCentersService: AdoptionCentersService) { }

  @Post()
  create(@Body() createAdoptionCenterDto: CreateAdoptionCenterDto) {
    return this.adoptionCentersService.create(createAdoptionCenterDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    // El controlador recibe el DTO de paginación y se lo pasa al servicio
    return this.adoptionCentersService.findAll(paginationDto);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    // Cambiamos el nombre del parámetro a 'term' (término de búsqueda)
    // Y llamamos a findOnePlain para que nos devuelva el objeto procesado
    return this.adoptionCentersService.findOnePlain(term);
  }


  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateAdoptionCenterDto: UpdateAdoptionCenterDto
  ) {
    return this.adoptionCentersService.update(id, updateAdoptionCenterDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.adoptionCentersService.remove(id);
  }
}
