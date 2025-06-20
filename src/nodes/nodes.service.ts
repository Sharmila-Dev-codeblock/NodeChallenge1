import { Injectable, NotFoundException } from '@nestjs/common';
import { DeepPartial, IsNull, Repository } from 'typeorm';
import { CreateNodeDto } from './dto/createNodeDto';
import { InjectRepository } from '@nestjs/typeorm';
import { Node } from './nodeEntity';


@Injectable()
export class NodesService {
    constructor(
        @InjectRepository(Node)
        private nodeRepository: Repository<Node>,
      ) {}
    
 async createNode(dto: CreateNodeDto): Promise<Node> {
    let parent: Node | null = null;
    let path = `/${dto.name}`;

    if (dto.parentId) {
      parent = await this.nodeRepository.findOne({ where: { id: dto.parentId } });
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

async getSubtreeByParentId(parentId?: string): Promise<Node[] | Node> {
  if (parentId) {
    const root = await this.nodeRepository.findOne({
      where: { id: parentId },
      relations: ['children'],
    });

    if (!root) {
      throw new NotFoundException(`Node not found with id: ${parentId}`);
    }

    await this.loadSubTreeChildren(root);
    return root;
  }


  const roots = await this.nodeRepository.find({
    where: { parent: IsNull() },
    relations: ['children'],
  });

  for (const root of roots) {
    await this.loadSubTreeChildren(root);
  }

  return roots;
}

  private async loadSubTreeChildren(node: Node): Promise<void> {
    node.children = await this.nodeRepository.find({
      where: { parent: { id: node.id } },
      relations: ['children'],
    });

    for (const child of node.children) {
      await this.loadSubTreeChildren(child);
    }
  }


async addProperty(nodeId: string, key: string, value: number): Promise<Node> {
  const node = await this.nodeRepository.findOne({ where: { id: nodeId } });
  if (!node) throw new NotFoundException('Node not found');

  node.value = node.value ? { ...node.value, [key]: value } : { [key]: value };

  return this.nodeRepository.save(node);
}





}
