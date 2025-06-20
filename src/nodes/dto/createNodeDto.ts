import {
  IsString,
  IsOptional,
  IsUUID,
  IsObject,
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsPropertyValue } from '../validators/isPropertyValue';

export class CreateNodeDto {
  @IsNotEmpty({ message: 'name must be a non-empty string' })
  @IsString({ message: 'name is required' })
  name: string;

  @IsOptional()
  @IsUUID('4', { message: 'parentId must be a valid UUID (v4)' })
  parentId?: string;

  @IsOptional()
  @IsObject({ message: 'value must be an object of key-value pairs' })
  @IsPropertyValue({
    message: 'value must be an object with string keys and number values only',
  })
  value?: Record<string, number>;
}
