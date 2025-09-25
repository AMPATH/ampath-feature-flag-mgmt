import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsDate,
  IsOptional,
} from 'class-validator';

export class CreateFeatureFlagDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsBoolean()
  status: boolean;
  @IsString()
  @IsNotEmpty()
  createdBy: string;
  @IsString()
  updatedBy: string;
  @IsBoolean()
  retired: boolean;
  @IsString()
  retiredBy: string;
}
