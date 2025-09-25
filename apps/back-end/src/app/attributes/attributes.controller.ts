import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AttributesService } from './attributes.service';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { UpdateAttributeDto } from './dto/update-attribute.dto';

@Controller('attributes')
export class AttributesController {
  constructor(private attributesService: AttributesService) {}

  @Post()
  create(@Body() attributesDto: CreateAttributeDto) {
    return this.attributesService.create(attributesDto);
  }

  @Get()
  getAll() {
    return this.attributesService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.attributesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() attributeDto: UpdateAttributeDto) {
    return this.attributesService.update(id, attributeDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.attributesService.remove(id);
  }
}
