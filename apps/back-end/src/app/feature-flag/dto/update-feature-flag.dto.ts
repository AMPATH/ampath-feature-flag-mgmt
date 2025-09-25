import { IsString, IsBoolean, IsDate, IsOptional } from 'class-validator';

export class UpdateFeatureFlagDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsBoolean()
  @IsOptional()
  status: boolean;
  @IsString()
  @IsOptional()
  createdBy: string;
  @IsString()
  @IsOptional()
  updatedBy: string;
  @IsBoolean()
  @IsOptional()
  retired: boolean;
  @IsString()
  @IsOptional()
  retiredBy: string;
  @IsDate()
  @IsOptional()
  retiredDate: string;
}
