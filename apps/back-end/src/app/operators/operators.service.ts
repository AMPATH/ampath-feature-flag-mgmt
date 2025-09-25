import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Operator } from './entity/operators.entity';
import { Repository } from 'typeorm';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';

@Injectable()
export class OperatorsService {
  constructor(
    @InjectRepository(Operator) private operatorRepository: Repository<Operator>
  ) {}

  create(createOperatorDto: CreateOperatorDto): Promise<Operator> {
    try {
      const operator = this.operatorRepository.create(createOperatorDto);
      return this.operatorRepository.save(operator);
    } catch {
      throw new HttpException(
        'Error creating operator',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  findAll(): Promise<Operator[]> {
    try {
      return this.operatorRepository.find();
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
    updateOperatorDto: UpdateOperatorDto
  ): Promise<Operator> {
    try {
      const existingOperator = await this.operatorRepository.preload({
        id,
        ...updateOperatorDto,
      });
      if (!existingOperator) {
        throw new Error(`Operator with id ${id} not found`);
      }
      return this.operatorRepository.save(existingOperator);
    } catch {
      throw new HttpException(
        `Error updating operator`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async remove(id: number): Promise<string> {
    const result = await this.operatorRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Operator with id ${id} not found`);
    }
    return `Operator with id ${id} has been deleted`;
  }
}
