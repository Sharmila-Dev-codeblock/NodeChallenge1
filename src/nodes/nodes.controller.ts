import { Controller, Get, Query, NotFoundException, Post, Body, Param, Patch } from '@nestjs/common';
import { NodesService } from './nodes.service';
import { Node } from './nodeEntity';
import { CreateNodeDto } from './dto/createNodeDto';
import { AddUpdatePropertyDto } from './dto/addUpdatePropertyDto';
import { GetTreeParamDto } from './dto/getTreeDto';

@Controller('nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

@Get('gettree')
async getFullTree(): Promise<Node | Node[]> {
  return this.nodesService.getSubtreeByParentId();
}

@Get('gettree/:parentId')
async getSubTree(@Param() params: GetTreeParamDto): Promise<Node | Node[]> {
  return this.nodesService.getSubtreeByParentId(params.parentId);
}


  @Post()
  async create(@Body() dto: CreateNodeDto): Promise<Node> {
    return this.nodesService.createNode(dto);
  }

  @Patch(':id/property')
  async addProperty(
    @Param('id') id: string,
    @Body() dto: AddUpdatePropertyDto
  ): Promise<Node> {
    return this.nodesService.addProperty(id, dto.key, dto.value);
  }

}
