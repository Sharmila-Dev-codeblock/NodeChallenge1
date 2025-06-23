import {
  Controller,
  Get,
  Query,
  NotFoundException,
  Post,
  Body,
  Param,
  Patch,
} from '@nestjs/common';
import { NodesService } from './nodes.service';
import { Node } from './nodeEntity';
import { CreateNodeDto } from './dto/createNodeDto';
import { AddUpdatePropertyDto } from './dto/addUpdatePropertyDto';
import { GetTreeParamDto } from './dto/getTreeDto';

/**
 *
 * Controller to create node , get the tree with the sub tree (children) and adds or updates the property of the node
 * @export
 * @class NodesController
 */

@Controller('nodes')
export class NodesController {
  constructor(private readonly nodesService: NodesService) {}

  /**
   * If parentId is not provided, it returns all root-level tree.
   * @return {*}  {(Promise<Node | Node[]>)}
   * @memberof NodesController
   */
  @Get('gettree')
  async getFullTree(): Promise<Node | Node[]> {
    return this.nodesService.getSubtreeByParentId();
  }

  /**
   * Returns the full sub tree of the given parentId with their children nodes.
   * @param {GetTreeParamDto} params parentId
   * @return {*}  {(Promise<Node | Node[]>)}
   * @memberof NodesController
   */
  @Get('gettree/:parentId')
  async getSubTree(@Param() params: GetTreeParamDto): Promise<Node | Node[]> {
    return this.nodesService.getSubtreeByParentId(params.parentId);
  }

  /**
   * Creates a new node. Can be a root node if no parentId is provided or a child of another node if parentid is provided.
   * Validates the request body using CreateNodeDto.
   * @param {CreateNodeDto} dto parentId and value are optional
   * @return {*}  {Promise<Node>}
   * @memberof NodesController
   */
  @Post()
  async create(@Body() dto: CreateNodeDto): Promise<Node> {
    return this.nodesService.createNode(dto);
  }

  /**
   * Adds or updates a key-value property in the node of the given id.
   * Validates the body using AddUpdatePropertyDto.
   * @param {string} id
   * @param {AddUpdatePropertyDto} dto
   * @return {*}  {Promise<Node>}
   * @memberof NodesController
   */
  @Patch(':id/property')
  async addProperty(
    @Param('id') id: string,
    @Body() dto: AddUpdatePropertyDto, // key-value pair where key is string and value is number
  ): Promise<Node> {
    return this.nodesService.addProperty(id, dto.key, dto.value);
  }
}
