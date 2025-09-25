import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { FeatureFlagService } from './feature-flag.service';
import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';

@Controller('feature-flags')
export class FeatureFlagController {
  constructor(private featureflagService: FeatureFlagService) {}

  @Post()
  create(@Body() createfeatureflagDto: CreateFeatureFlagDto) {
    return this.featureflagService.create(createfeatureflagDto);
  }

  @Get()
  getAll() {
    return this.featureflagService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.featureflagService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updatefeatureflagDto: UpdateFeatureFlagDto
  ) {
    return this.featureflagService.update(id, updatefeatureflagDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.featureflagService.remove(id);
  }
}
