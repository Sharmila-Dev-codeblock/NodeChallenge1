// src/nodes/dto/getTreeParam.dto.ts
import { IsOptional, IsUUID } from 'class-validator';

export class GetTreeParamDto {
  @IsOptional()
  @IsUUID('all', { message: 'parentId must be a valid UUID' })
  parentId?: string;
}
