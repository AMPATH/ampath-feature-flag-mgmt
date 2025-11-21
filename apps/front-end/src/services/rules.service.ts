import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { CreateRuleDto, RuleTypes, UpdateRuleDto } from '../rules/rules.types';
import { VoidDto } from '../shared/dialog/void-dialog/types';

@Injectable({ providedIn: 'root' })
export class RulesService extends BaseService {
  private endPoint = '/rules';

  private getEndpoint(endPoint: string = this.endPoint) {
    return this.getUrl('FEATURE_FLAG') + endPoint;
  }

  public fetch() {
    const url = this.getEndpoint();
    return this.http.get<RuleTypes[]>(url);
  }
  public fetchByFeatureFlagId(featureFlagId: number) {
    const url = `${this.getEndpoint()}/feature-flag/${featureFlagId}`;
    return this.http.get<RuleTypes[]>(url);
  }

  public create(createRuleDto: CreateRuleDto) {
    const url = this.getEndpoint();
    return this.http.post(url, createRuleDto);
  }

  public update(id: number, updateRuleDto: UpdateRuleDto) {
    const url = this.getEndpoint() + '/' + id;
    return this.http.patch(url, updateRuleDto);
  }

  public delete(id: number, voidDto: VoidDto) {
    const url = this.getEndpoint() + '/' + id;
    return this.http.delete(url, {
      body: {
        ...voidDto,
      },
    });
  }
}
