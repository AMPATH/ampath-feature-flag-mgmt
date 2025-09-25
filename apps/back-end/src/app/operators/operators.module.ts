import { Module } from '@nestjs/common';
import { OperatorsController } from './operators.controller';
import { OperatorsService } from './operators.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Operator } from './entity/operators.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Operator])],
  controllers: [OperatorsController],
  providers: [OperatorsService],
})
export class OperatorsModule {}
