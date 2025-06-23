// src/nodes/dto/getTreeParam.dto.ts
import { IsOptional, IsUUID } from 'class-validator';

/**
 * DTO to get the subtree
 * @export
 * @class GetTreeParamDto
 */
export class GetTreeParamDto {
  /**
   * parentId is optional
   * parentId must be a valid UUID
   * @type {string}
   * @memberof GetTreeParamDto
   */
  @IsOptional()
  @IsUUID('all', { message: 'parentId must be a valid UUID' })
  parentId?: string;
}
