import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';


/**
 * Property is a key-value pair 
 * @export
 * @class AddUpdatePropertyDto
 */
export class AddUpdatePropertyDto {
  /**
   * Key must be a string
   * @type {string}
   * @memberof AddUpdatePropertyDto
   */
  @IsString({ message: 'key must be a string' })
  key: string;

  /**
   * value must be a number
   * @type {number}
   * @memberof AddUpdatePropertyDto
   */
  @IsNumber({}, { message: 'value must be a number' })
  value: number;
}
