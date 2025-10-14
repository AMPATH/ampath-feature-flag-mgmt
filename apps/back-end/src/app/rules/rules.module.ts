import { Module } from '@nestjs/common';
import { RulesController } from './rules.controller';
import { RulesService } from './rules.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rules } from './entity/rules.entity';
import { FeatureFlagService } from '../feature-flag/feature-flag.service';
import { FeatureFlag } from '../feature-flag/entity/feature-flag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rules, FeatureFlag])],
  controllers: [RulesController],
  providers: [RulesService, FeatureFlagService],
})
export class RulesModule {}
