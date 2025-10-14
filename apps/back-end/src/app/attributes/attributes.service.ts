import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attribute } from './entity/attribute.entity';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

import { AmrsUser } from '../auth/dto/amrs-auth.dto';
import {
  CreateAuditDto,
  UpdateAuditDto,
  VoidAuditDto,
  VoidEntityDto,
} from '../common/dto';

@Injectable()
export class AttributesService {
  constructor(
    @InjectRepository(Attribute)
    private attributesRepository: Repository<Attribute>
  ) {}
  create(
    attributesDto: CreateAttributeDto,
    user: AmrsUser
  ): Promise<Attribute> {
    try {
      const createAttributeAuditInfo: CreateAuditDto = {
        voided: false,
        createdBy: user.username,
      };
      const featureflag = this.attributesRepository.create({
        ...attributesDto,
        ...createAttributeAuditInfo,
      });
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
      return this.attributesRepository.findBy({
        voided: false,
      });
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
    attributesDto: UpdateAttributeDto,
    user: AmrsUser
  ): Promise<Attribute> {
    const attribute = await this.attributesRepository.findOneBy({
      id: id,
    });
    if (!attribute) {
      throw new NotFoundException();
    }
    try {
      const updateAttributeAuditInfo: UpdateAuditDto = {
        updatedBy: user.username,
      };
      const entity = this.attributesRepository.create({
        ...attribute,
        ...attributesDto,
        ...updateAttributeAuditInfo,
      });
      return this.attributesRepository.save(entity);
    } catch {
      throw new HttpException(
        'Error updating attribute',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async void(
    id: number,
    voidAttributeDto: VoidEntityDto,
    user: AmrsUser
  ): Promise<Attribute> {
    const attribute = await this.attributesRepository.findOneBy({
      id: id,
    });
    if (!attribute) {
      throw new NotFoundException();
    }
    try {
      const voidAuditInfo: VoidAuditDto = {
        voided: true,
        voidedBy: user.username,
        voidedDate: new Date(),
        voidedReason: voidAttributeDto.voidedReason,
      };
      const entity = this.attributesRepository.create({
        ...attribute,
        ...voidAuditInfo,
      });
      return this.attributesRepository.save(entity);
    } catch {
      throw new HttpException(
        'Error deleting attribute',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
