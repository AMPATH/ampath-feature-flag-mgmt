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
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { GetFeatureFlagDto } from './dto/get-feature-flag.dto';
import { AmrsUser } from '../auth/dto/amrs-auth.dto';
import { VoidEntityDto } from '../common/dto';
import { Public } from '../auth/decorators/public.decorator';

@Controller('rules')
export class RulesController {
  constructor(private rulesService: RulesService) {}

  @Post()
  create(@Body() createRuleDto: CreateRuleDto, @Request() req) {
    const user: AmrsUser = req.user;
    if (!user) {
      throw new BadRequestException();
    }
    return this.rulesService.create(createRuleDto, user);
  }

  @Get()
  getAll() {
    return this.rulesService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: number) {
    return this.rulesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateRuleDto: UpdateRuleDto,
    @Request() req
  ) {
    const user: AmrsUser = req.user;
    if (!user) {
      throw new BadRequestException();
    }
    return this.rulesService.update(id, updateRuleDto, user);
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
    return this.rulesService.void(id, voidEntityDto, user);
  }

  @Get('feature-flag/:featureFlagId')
  getFeatureFlagRules(@Param('featureFlagId') featureFlagId: number) {
    return this.rulesService.findRulesByFeatureFlagId(featureFlagId);
  }

  @Public()
  @Post('feature-flag')
  getFlag(@Body() getFeatureFlagDto: GetFeatureFlagDto) {
    return this.rulesService.getFeatureFlag(getFeatureFlagDto);
  }
}
