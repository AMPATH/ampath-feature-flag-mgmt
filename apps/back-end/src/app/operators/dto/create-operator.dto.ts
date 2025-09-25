import { IsNotEmpty, IsString } from 'class-validator';

export class CreateOperatorDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsString()
  description: string;
}
