import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { AttributeType } from '../../common/dto';

export class CreateAttributeDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  description?: string;
  @IsEnum(AttributeType)
  type: AttributeType;
}
