import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from './entity/create-attribute.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@Injectable()
export class AttributesService {
  constructor(
    @InjectRepository(Attribute)
    private attributesRepository: Repository<Attribute>
  ) {}
  create(attributesDto: CreateAttributeDto): Promise<Attribute> {
    try {
      const featureflag = this.attributesRepository.create(attributesDto);
      return this.attributesRepository.save(featureflag);
    } catch {
      throw new HttpException(
        'Error creating attribute',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  findAll(): Promise<Attribute[]> {
    try {
      return this.attributesRepository.find();
    } catch {
      throw new HttpException(
        'Error fetching attributes',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  findOne(id: number): Promise<Attribute> {
    try {
      return this.attributesRepository.findOneBy({ id });
    } catch {
      throw new HttpException(
        `Error fetching attribute`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: number,
    attributesDto: UpdateAttributeDto
  ): Promise<Attribute> {
    try {
      const attribute = await this.attributesRepository.preload({
        id,
        ...attributesDto,
      });
      if (!attribute) {
        throw new Error(`Attribute with id ${id} not found`);
      }
      return this.attributesRepository.save(attribute);
    } catch {
      throw new HttpException(
        'Error updating attribute',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: number): Promise<string> {
    const result = await this.attributesRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Attribute with id ${id} not found`);
    }
    return `Attribute with id ${id} has been deleted`;
  }
}
