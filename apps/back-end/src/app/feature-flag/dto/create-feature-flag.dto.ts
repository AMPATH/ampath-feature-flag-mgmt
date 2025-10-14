import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateFeatureFlagDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsBoolean()
  status: boolean;
}
