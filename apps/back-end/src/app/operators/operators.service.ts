import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Operator } from './entity/operators.entity';
import { Repository } from 'typeorm';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { AmrsUser } from '../auth/dto/amrs-auth.dto';
import {
  CreateAuditDto,
  UpdateAuditDto,
  VoidAuditDto,
  VoidEntityDto,
} from '../common/dto';

@Injectable()
export class OperatorsService {
  constructor(
    @InjectRepository(Operator) private operatorRepository: Repository<Operator>
  ) {}

  create(
    createOperatorDto: CreateOperatorDto,
    user: AmrsUser
  ): Promise<Operator> {
    try {
      const createOperatorAuditInfo: CreateAuditDto = {
        voided: false,
        createdBy: user.username,
      };
      const operatorEntity = this.operatorRepository.create({
        ...createOperatorDto,
        ...createOperatorAuditInfo,
      });
      return this.operatorRepository.save(operatorEntity);
    } catch {
      throw new HttpException(
        'Error creating operator',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  findAll(): Promise<Operator[]> {
    try {
      return this.operatorRepository.findBy({
        voided: false,
      });
    } catch {
      throw new HttpException(
        'Error fetching operators',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  findOne(id: number): Promise<Operator> {
    try {
      return this.operatorRepository.findOneBy({ id });
    } catch {
      throw new HttpException(
        `Error fetching operator`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async update(
    id: number,
    updateOperatorDto: UpdateOperatorDto,
    user: AmrsUser
  ): Promise<Operator> {
    const operator = await this.operatorRepository.findOneBy({
      id: id,
    });
    if (!operator) {
      throw new NotFoundException();
    }
    try {
      const updateAuditInfo: UpdateAuditDto = {
        updatedBy: user.username,
      };
      const entity = this.operatorRepository.create({
        ...operator,
        ...updateOperatorDto,
        ...updateAuditInfo,
      });
      return this.operatorRepository.save(entity);
    } catch {
      throw new HttpException(
        `Error updating operator`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async void(
    id: number,
    voidAttributeDto: VoidEntityDto,
    user: AmrsUser
  ): Promise<Operator> {
    const operator = await this.operatorRepository.findOneBy({
      id: id,
    });
    if (!operator) {
      throw new NotFoundException();
    }
    try {
      const voidAuditInfo: VoidAuditDto = {
        voided: true,
        voidedBy: user.username,
        voidedDate: new Date(),
        voidedReason: voidAttributeDto.voidedReason,
      };
      const entity = this.operatorRepository.create({
        ...operator,
        ...voidAuditInfo,
      });
      return this.operatorRepository.save(entity);
    } catch {
      throw new HttpException(
        'Error deleting attribute',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
