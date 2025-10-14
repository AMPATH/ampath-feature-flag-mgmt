import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { FeatureFlagService } from './feature-flag.service';
import { CreateFeatureFlagDto } from './dto/create-feature-flag.dto';
import { UpdateFeatureFlagDto } from './dto/update-feature-flag.dto';
import { AmrsUser } from '../auth/dto/amrs-auth.dto';
import { VoidEntityDto } from '../common/dto';

@Controller('feature-flags')
export class FeatureFlagController {
  constructor(private featureflagService: FeatureFlagService) {}

  @Post()
  create(@Body() createfeatureflagDto: CreateFeatureFlagDto, @Request() req) {
    const user: AmrsUser = req.user;
    if (!user) {
      throw new BadRequestException();
    }
    return this.featureflagService.create(createfeatureflagDto, user);
  }

  @Get()
  getAll() {
    return this.featureflagService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.featureflagService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updatefeatureflagDto: UpdateFeatureFlagDto,
    @Request() req
  ) {
    const user: AmrsUser = req.user;
    if (!user) {
      throw new BadRequestException();
    }
    return this.featureflagService.update(id, updatefeatureflagDto, user);
  }

  @Delete(':id')
  delete(
    @Param('id') id: number,
    @Body() voidEntityDto: VoidEntityDto,
    @Request() req
  ) {
    const user: AmrsUser = req.user;
    if (!user) {
      throw new BadRequestException();
    }
    return this.featureflagService.void(id, voidEntityDto, user);
  }
}
