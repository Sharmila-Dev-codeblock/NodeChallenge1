import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class AddUpdatePropertyDto {
  @IsString({ message: 'key must be a string' })
  key: string;

  @IsNumber({}, { message: 'value must be a number' })
  value: number;
}
