import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateRuleDto {
  @IsInt()
  @IsNotEmpty()
  public readonly featureFlagId: number;
  @IsInt()
  @IsNotEmpty()
  public readonly attributeId: number;
  @IsInt()
  @IsNotEmpty()
  public readonly operatorId: number;
  @IsNotEmpty()
  public readonly value: string;
}
