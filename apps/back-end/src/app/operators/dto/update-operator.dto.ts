import { IsOptional, IsString } from 'class-validator';

export class UpdateOperatorDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsOptional()
  @IsString()
  description: string;
}
