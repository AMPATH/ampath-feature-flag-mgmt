import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rules } from './entity/rules.entity';
import { Repository } from 'typeorm';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { GetFeatureFlagDto } from './dto/get-feature-flag.dto';
import { FeatureFlagService } from '../feature-flag/feature-flag.service';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rules) private rulesRepository: Repository<Rules>,
    private featureFlagService: FeatureFlagService
  ) {}

  async create(createRuleDto: CreateRuleDto): Promise<Rules> {
    const payload = {
      featureFlag: { id: createRuleDto.featureFlagId },
      attribute: { id: createRuleDto.attributeId },
      operator: { id: createRuleDto.operatorId },
      value: createRuleDto.value,
    };
    const newRule = this.rulesRepository.create(payload);
    return this.rulesRepository.save(newRule);
  }

  findAll(): Promise<Rules[]> {
    return this.rulesRepository.find();
  }

  findOne(id: number): Promise<Rules> {
    return this.rulesRepository.findOneBy({ id });
  }

  async update(id: number, updateRuleDto: UpdateRuleDto): Promise<Rules> {
    const rule = await this.rulesRepository.preload({
      id,
      ...updateRuleDto,
    });
    if (!rule) {
      throw new Error(`Attribute with id ${id} not found`);
    }
    return this.rulesRepository.save(rule);
  }

  async remove(id: number): Promise<string> {
    const result = await this.rulesRepository.delete(id);
    if (result.affected === 0) {
      throw new Error(`Rules with id ${id} not found`);
    }
    return `Rules with id ${id} has been deleted`;
  }

  async getFeatureFlag(getFeatureFlagDto: GetFeatureFlagDto) {
    const evaluatedRes = {};
    Object.keys(getFeatureFlagDto.context).forEach((key) => {
      evaluatedRes[key] = false;
    });
    const featureFlag = await this.featureFlagService.getByName(
      getFeatureFlagDto.featureFlagName
    );
    if (featureFlag.status === false) {
      return evaluatedRes;
    }
    const rules = await this.rulesRepository.findBy({
      featureFlag: { name: getFeatureFlagDto.featureFlagName },
    });

    return this.evaluateRule(getFeatureFlagDto, rules, evaluatedRes);
  }

  private evaluateRule(
    getFeatureFlagDto: GetFeatureFlagDto,
    rules: Rules[],
    evaluatedRes: any
  ) {
    const context = getFeatureFlagDto.context;
    for (const rule of rules) {
      const { operator, attribute, value } = rule;
      const formatedAttributeName = attribute.name
        .replace(/\s+/g, '')
        .toLowerCase();
      if (context[formatedAttributeName]) {
        if (operator.name === 'in') {
          const arrayValue = value.split(',');
          const hasValue = arrayValue.some(
            (v) => v === context[formatedAttributeName]
          );
          evaluatedRes[formatedAttributeName] = hasValue;
        }
      }
    }
    return evaluatedRes;
  }
}
