import { Injectable } from '@nestjs/common';
import { CreateAdoptionCenterDto } from './dto/create-adoption-center.dto';
import { UpdateAdoptionCenterDto } from './dto/update-adoption-center.dto';

@Injectable()
export class AdoptionCentersService {
  create(createAdoptionCenterDto: CreateAdoptionCenterDto) {
    return 'This action adds a new adoptionCenter';
  }

  findAll() {
    return `This action returns all adoptionCenters`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adoptionCenter`;
  }

  update(id: number, updateAdoptionCenterDto: UpdateAdoptionCenterDto) {
    return `This action updates a #${id} adoptionCenter`;
  }

  remove(id: number) {
    return `This action removes a #${id} adoptionCenter`;
  }
}
