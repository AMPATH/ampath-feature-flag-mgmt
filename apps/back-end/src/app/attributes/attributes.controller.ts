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
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';
import { AmrsUser } from '../auth/dto/amrs-auth.dto';
import { VoidEntityDto } from '../common/dto';

@Controller('attributes')
export class AttributesController {
  constructor(private attributesService: AttributesService) {}

  @Post()
  create(@Body() attributesDto: CreateAttributeDto, @Request() req) {
    const user: AmrsUser = req.user;
    return this.attributesService.create(attributesDto, user);
  }

  @Get()
  getAll() {
    return this.attributesService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.attributesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() attributeDto: UpdateAttributeDto,
    @Request() req
  ) {
    const user: AmrsUser = req.user;
    return this.attributesService.update(id, attributeDto, user);
  }

  @Delete(':id')
  delete(
    @Param('id') id: number,
    @Request() req,
    @Body() voidAttributeDto: VoidEntityDto
  ) {
    const user: AmrsUser = req.user;
    return this.attributesService.void(id, voidAttributeDto, user);
  }
}
