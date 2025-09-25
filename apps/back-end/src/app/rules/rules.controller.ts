import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { GetFeatureFlagDto } from './dto/get-feature-flag.dto';

@Controller('rules')
export class RulesController {
  constructor(private rulesService: RulesService) {}

  @Post()
  create(@Body() createRuleDto: CreateRuleDto) {
    return this.rulesService.create(createRuleDto);
  }

  @Get()
  getAll() {
    return this.rulesService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.rulesService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateRuleDto: UpdateRuleDto) {
    return this.rulesService.update(id, updateRuleDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.rulesService.remove(id);
  }

  @Post('feature-flag')
  getFlag(@Body() getFeatureFlagDto: GetFeatureFlagDto) {
    return this.rulesService.getFeatureFlag(getFeatureFlagDto);
  }
}
