import {
  IsString,
  IsOptional,
  IsUUID,
  IsObject,
  IsNotEmpty,
} from 'class-validator';
import { IsPropertyValue } from '../validators/isPropertyValue';

/**
 * DTO for creating a new Node
 * @export
 * @class CreateNodeDto
 */

export class CreateNodeDto {
  /**
   * The name of the node is required and it should be string
   * @type {string}
   * @memberof CreateNodeDto
   */
  @IsNotEmpty({ message: 'name must be a non-empty string' })
  @IsString({ message: 'name is required' })
  name: string;

  /**
   * ParentId is optional and should be valid UUID
   * @type {string}
   * @memberof CreateNodeDto
   */
  @IsOptional()
  @IsUUID('4', { message: 'parentId must be a valid UUID (v4)' })
  parentId?: string;

  /**
   * Value is optional and is key-value pair
   * Key must be string and value must be number
   * @type {Record<string, number>}
   * @memberof CreateNodeDto
   */
  @IsOptional()
  @IsObject({ message: 'value must be an object of key-value pairs' })
  @IsPropertyValue({
    message: 'value must be an object with string keys and number values only',
  }) //Validator to check if the value is an object with string keys and number values
  value?: Record<string, number>;
}
