import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { OperatorsService } from './operators.service';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { UpdateOperatorDto } from './dto/update-operator.dto';
import { AmrsUser } from '../auth/dto/amrs-auth.dto';
import { VoidEntityDto } from '../common/dto';

@Controller('operators')
export class OperatorsController {
  constructor(private operatorsService: OperatorsService) {}

  @Post()
  create(@Body() createOperatorDto: CreateOperatorDto, @Request() req) {
    const user: AmrsUser = req.user;
    return this.operatorsService.create(createOperatorDto, user);
  }

  @Get()
  getAll() {
    return this.operatorsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.operatorsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateOperatorDto: UpdateOperatorDto,
    @Request() req
  ) {
    const user: AmrsUser = req.user;
    return this.operatorsService.update(id, updateOperatorDto, user);
  }

  @Delete(':id')
  delete(
    @Param('id') id: number,
    @Body() voidAttributeDto: VoidEntityDto,
    @Request() req
  ) {
    const user: AmrsUser = req.user;
    return this.operatorsService.void(id, voidAttributeDto, user);
  }
}
