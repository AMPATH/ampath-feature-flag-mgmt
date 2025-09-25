import { IsInt, IsOptional } from 'class-validator';

export class UpdateRuleDto {
  @IsInt()
  @IsOptional()
  featureFlagId: number;
  @IsInt()
  @IsOptional()
  attributeId: number;
  @IsInt()
  @IsOptional()
  operatorId: number;
  @IsOptional()
  value: string;
}
