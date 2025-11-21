import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Rules } from './entity/rules.entity';
import { Repository } from 'typeorm';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { GetFeatureFlagDto } from './dto/get-feature-flag.dto';
import { FeatureFlagService } from '../feature-flag/feature-flag.service';
import { AmrsUser } from '../auth/dto/amrs-auth.dto';
import {
  CreateAuditDto,
  OperatorType,
  UpdateAuditDto,
  VoidAuditDto,
  VoidEntityDto,
} from '../common/dto';

@Injectable()
export class RulesService {
  constructor(
    @InjectRepository(Rules) private rulesRepository: Repository<Rules>,
    private featureFlagService: FeatureFlagService
  ) {}

  async create(createRuleDto: CreateRuleDto, user: AmrsUser): Promise<Rules> {
    const createRuleAuditInfo: CreateAuditDto = {
      voided: false,
      createdBy: user.username,
    };
    const payload = {
      featureFlag: { id: createRuleDto.featureFlagId },
      attribute: { id: createRuleDto.attributeId },
      operator: { id: createRuleDto.operatorId },
      value: createRuleDto.value,
      ...createRuleAuditInfo,
    };
    const newRule = this.rulesRepository.create(payload);
    return this.rulesRepository.save(newRule);
  }

  findAll(): Promise<Rules[]> {
    return this.rulesRepository.findBy({
      voided: false,
    });
  }

  findOne(id: number): Promise<Rules> {
    return this.rulesRepository.findOneBy({ id });
  }
  findRulesByFeatureFlagId(featureFlagId: number) {
    return this.rulesRepository.findBy({
      featureFlag: {
        id: featureFlagId,
      },
      voided: false,
    });
  }

  async update(
    id: number,
    updateRuleDto: UpdateRuleDto,
    user: AmrsUser
  ): Promise<Rules> {
    const rule = await this.rulesRepository.findOneBy({
      id: id,
    });
    if (!rule) {
      throw new NotFoundException();
    }

    try {
      const ruleAuditInfo: UpdateAuditDto = {
        updatedBy: user.username,
      };
      const updatePayload = {
        ...updateRuleDto,
      };
      if (updateRuleDto.attributeId) {
        updatePayload['attribute'] = {
          id: updateRuleDto.attributeId,
        };
      }
      if (updateRuleDto.featureFlagId) {
        updatePayload['featureFlag'] = {
          id: updateRuleDto.featureFlagId,
        };
      }
      if (updateRuleDto.operatorId) {
        updatePayload['operator'] = {
          id: updateRuleDto.operatorId,
        };
      }
      const ruleEntity = this.rulesRepository.create({
        ...rule,
        ...updatePayload,
        ...ruleAuditInfo,
      });

      return this.rulesRepository.save(ruleEntity);
    } catch {
      throw new HttpException(
        `Error updating rule`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async void(
    id: number,
    voidEntityDto: VoidEntityDto,
    user: AmrsUser
  ): Promise<Rules> {
    const rule = await this.rulesRepository.findOneBy({
      id: id,
    });
    if (!rule) {
      throw new NotFoundException();
    }
    try {
      const voidAuditInfo: VoidAuditDto = {
        voided: true,
        voidedBy: user.username,
        voidedDate: new Date(),
        voidedReason: voidEntityDto.voidedReason,
      };
      const entity = this.rulesRepository.create({
        ...rule,
        ...voidAuditInfo,
      });
      return this.rulesRepository.save(entity);
    } catch {
      throw new HttpException(
        'Error voiding rule',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getFeatureFlag(getFeatureFlagDto: GetFeatureFlagDto) {
    const evaluatedRes = {};
    const featureFlag = await this.featureFlagService.getByName(
      getFeatureFlagDto.featureFlagName
    );

    /*
     if feature flag is off return false
    */

    if (featureFlag.status === false) {
      Object.keys(getFeatureFlagDto.context).forEach((key) => {
        evaluatedRes[key] = false;
      });
      return evaluatedRes;
    }
    const rules = await this.rulesRepository.findBy({
      featureFlag: { name: getFeatureFlagDto.featureFlagName, voided: false },
    });
    /* 
    if feature flag is on an there are no rules set then return
    true
    */
    if (featureFlag.status === true && (rules.length === 0 || !rules)) {
      Object.keys(getFeatureFlagDto.context).forEach((key) => {
        evaluatedRes[key] = true;
      });

      return evaluatedRes;
    }

    if (featureFlag.status === true && rules.length > 0) {
      // set values to false and evaluate individually
      Object.keys(getFeatureFlagDto.context).forEach((key) => {
        evaluatedRes[key] = true;
      });

      return this.evaluateRule(getFeatureFlagDto, rules, evaluatedRes);
    }

    return evaluatedRes;
  }

  private evaluateRule(
    getFeatureFlagDto: GetFeatureFlagDto,
    rules: Rules[],
    evaluatedRes: { [key: string]: boolean }
  ) {
    const context = getFeatureFlagDto.context;
    for (const rule of rules) {
      const { operator, attribute, value } = rule;
      const formatedAttributeName = attribute.name
        .replace(/\s+/g, '')
        .toLowerCase();
      if (context[formatedAttributeName]) {
        if (operator.name === OperatorType.In) {
          const arrayValue = value.split(',');
          const hasValue = arrayValue.some(
            (v) => v === context[formatedAttributeName]
          );
          evaluatedRes[formatedAttributeName] = hasValue;
        }
        if (operator.name === OperatorType.NotIn) {
          const arrayValue = value.split(',');
          const hasValue = arrayValue.every(
            (v) => v !== context[formatedAttributeName]
          );
          evaluatedRes[formatedAttributeName] = hasValue;
        }
        if (operator.name === OperatorType.Equals) {
          evaluatedRes[formatedAttributeName] =
            context[formatedAttributeName] === value;
        }
        if (operator.name === OperatorType.NotEqual) {
          evaluatedRes[formatedAttributeName] =
            context[formatedAttributeName] !== value;
        }
        if (operator.name === OperatorType.GreaterThan) {
          evaluatedRes[formatedAttributeName] =
            context[formatedAttributeName] > Number(value);
        }
        if (operator.name === OperatorType.LessThan) {
          evaluatedRes[formatedAttributeName] =
            context[formatedAttributeName] < Number(value);
        }
      }
    }
    return evaluatedRes;
  }
}
