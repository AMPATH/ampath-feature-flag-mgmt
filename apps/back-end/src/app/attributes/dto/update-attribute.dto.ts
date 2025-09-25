import { IsOptional, IsString } from 'class-validator';

export class UpdateAttributeDto {
  @IsString()
  @IsOptional()
  name: string;
  @IsOptional()
  @IsString()
  description?: string;
}
