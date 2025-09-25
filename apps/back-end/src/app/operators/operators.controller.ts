import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';

@Controller('operators')
export class OperatorsController {
  constructor(private operatorsService: OperatorsService) {}

  @Post()
  create(@Body() createOperatorDto: CreateOperatorDto) {
    return this.operatorsService.create(createOperatorDto);
  }

  @Get()
  getAll() {
    return this.operatorsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.operatorsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateOperatorDto: UpdateOperatorDto
  ) {
    return this.operatorsService.update(id, updateOperatorDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.operatorsService.remove(id);
  }
}
