import { Injectable, NotFoundException } from '@nestjs/common';
import { DeepPartial, IsNull, Repository } from 'typeorm';
import { CreateNodeDto } from './dto/createNodeDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Node } from './nodeEntity';

/**
 *
 *
 * @export
 * @class
 */
@Injectable()
export class NodesService {
  constructor(
    @InjectRepository(Node)
    private nodeRepository: Repository<Node>,
  ) {}

  /**
   * CreateNode creates a node by handling the parentId optionally
   * If parentId is passed if the parentid is found node is created and the path is determined with the name of parent and name of the current node
   * If parentId is not provided it creates a new node which is the root and a new path is determined with the name of the node
   * value is a key-value pair which is optional
   * @param {CreateNodeDto} dto
   * @return {*}  {Promise<Node>}
   * @memberof NodesService
   * @throws NotFoundException if the parent node of the given parentId is not found or doesnt exist
   */

  async createNode(dto: CreateNodeDto): Promise<Node> {
    let parent: Node | null = null;
    let path = `/${dto.name}`;

    if (dto.parentId) {
      parent = await this.nodeRepository.findOne({
        where: { id: dto.parentId },
      });
      if (!parent) throw new NotFoundException('Parent node not found');
      path = `${parent.path}/${dto.name}`;
    }

    const newNode = this.nodeRepository.create({
      name: dto.name,
      parent,
      value: dto.value ?? null,
      path,
    } as DeepPartial<Node>);

    return this.nodeRepository.save(newNode);
  }

  /**
   * getSubtreeByParentId gets the data as a tree by calling loadSubTreeChildren if parentId is found
   * If parentId is not provided it gets the tree from the root
   * @param {string} [parentId] is optional
   * @return {*}  {(Promise<Node[] | Node>)}
   * @memberof NodesService
   * @throws NotFoundException if the parent node of the given parentId is not found or doesnt exist
   */

  async getSubtreeByParentId(parentId?: string): Promise<Node[] | Node> {
    if (parentId) {
      const root = await this.nodeRepository.findOne({
        where: { id: parentId },
        relations: ['children'],
      });

      if (!root) {
        throw new NotFoundException(`Node not found with id: ${parentId}`);
      }

      //To load the corresponding children of the node
      await this.loadSubTreeChildren(root);
      return root;
    }

    const roots = await this.nodeRepository.find({
      where: { parent: IsNull() },
      relations: ['children'],
    });

    //To load the corresponding children of the node
    for (const root of roots) {
      await this.loadSubTreeChildren(root);
    }

    return roots;
  }

  /**
   *
   * loadSubTreeChildren recursively loads all children of the node with the given id
   * @private
   * @param {Node} node
   * @return {*}  {Promise<void>}
   * @memberof NodesService
   */
  private async loadSubTreeChildren(node: Node): Promise<void> {
    node.children = await this.nodeRepository.find({
      where: { parent: { id: node.id } },
      relations: ['children'],
    });

    for (const child of node.children) {
      await this.loadSubTreeChildren(child);
    }
  }

  /**
   * addProperty adds or updates the node of the given nodeId
   * Property is a key-value pair.
   *  If the key already exists, its value is overwritten
   * @param {string} nodeId
   * @param {string} key
   * @param {number} value
   * @return {Promise<Node>} The updated node
   * @memberof NodesService
   * @throws NotFoundException if the node is not found.
   */
  async addProperty(nodeId: string, key: string, value: number): Promise<Node> {
    const node = await this.nodeRepository.findOne({ where: { id: nodeId } });
    if (!node) throw new NotFoundException('Node not found');

    node.value = node.value
      ? { ...node.value, [key]: value }
      : { [key]: value };

    return this.nodeRepository.save(node);
  }
}
