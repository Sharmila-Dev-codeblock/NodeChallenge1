import { Test, TestingModule } from '@nestjs/testing';
import { NodesService } from './nodes.service';
import { ObjectLiteral, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Node } from './nodeEntity';

describe('NodesService', () => {
  let service: NodesService;
   let repo: jest.Mocked<Repository<Node>>;

function createMockRepository<T extends ObjectLiteral>(): jest.Mocked<Partial<Repository<T>>> {
  return {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };
}



 beforeEach(async () => {
  const mockRepo = createMockRepository<Node>();

  const module: TestingModule = await Test.createTestingModule({
    providers: [
      NodesService,
      {
        provide: getRepositoryToken(Node),
        useValue: mockRepo, // ✅ useValue instead of useClass
      },
    ],
  }).compile();

  service = module.get<NodesService>(NodesService);
  repo = module.get(getRepositoryToken(Node)) as jest.Mocked<Repository<Node>>;

    repo.find.mockResolvedValue([]); 
  jest.spyOn(service as any, 'loadSubTreeChildren').mockImplementation(
    async (node: Node, depth: number = 0): Promise<void> => {
      if (depth > 5) return;
      node.children = await repo.find({
        where: { parent: { id: node.id } },
        relations: ['children'],
      });
      for (const child of node.children) {
        await (service as any).loadSubTreeChildren(child, depth + 1);
      }
    }
  );
});



    afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSubtreeById', () => {
    it('should return subtree for valid root id', async () => {
const mockNode: Node = {
  id: '1',
  name: 'AlphaPC',
  path: '/AlphaPC',
  value: { Width: 100 },
  parent: null,
  children: [],
};      repo.findOne.mockResolvedValue(mockNode);
      const result = await service.getSubtreeByParentId('1');
      expect(result).toEqual(mockNode);
    });

    it('should throw NotFoundException for invalid root id', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.getSubtreeByParentId('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getSubtree', () => {
    it('should return all root trees when id is not provided', async () => {
      const rootNodes = [
        { id: '1', name: 'AlphaPC', parent: null,   value: { Width: 100 },path:'/AlphaPC',children: [] } as Node,
        { id: '2', name: 'BetaPC', parent: null, value: { Width: 200 },path:'/BetaPC',children: [] } as Node,
      ];

      repo.find.mockResolvedValue(rootNodes);
      const result = await service.getSubtreeByParentId();
      expect(result).toEqual(rootNodes);
    });
  });

  describe('addOrUpdateProperty', () => {
    it('should add or update property', async () => {
     const node: Node = {
      id: '1',
      name: 'Processing',
      path: '/AlphaPC/Processing',
      value: { RAM: 8 },
      parent: null,
      children: [],
    };
      repo.findOne.mockResolvedValue(node);
      repo.save.mockResolvedValue({ ...node, value: { RAM: 16 } });

      const result = await service.addProperty('1', 'RAM', 16);
      expect(result.value).toEqual({RAM:16});
    });

    it('should throw if node not found', async () => {
      repo.findOne.mockResolvedValue(null);
      await expect(service.addProperty('invalid', 'RAM', 16)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createNode', () => {
  it('should create a node with parent', async () => {
    const dto = { name: 'CPU', parentId: '1', value: { Cores: 4 } };
    const parentNode: Node = {
      id: '1',
      name: 'AlphaPC',
      path: '/AlphaPC',
      value: { Height: 450, Width: 180 },
      parent: null,
      children: [],
    };

    const createdNode: Node = {
      id: '2',
      name: 'CPU',
      path: '/AlphaPC/Processing/CPU',
      value: { Cores: 4 },
      parent: parentNode,
      children: [],
    };

    repo.findOne.mockResolvedValue(parentNode);
    repo.create.mockReturnValue(createdNode);
    repo.save.mockResolvedValue(createdNode);

    const result = await service.createNode(dto);
    expect(result.name).toBe('CPU');
    expect(result.path).toBe('/AlphaPC/Processing/CPU');
    expect(result.parent).toEqual(parentNode);
  });

  it('should throw if parent not found', async () => {
    const dto = { name: 'Processing', parentId: 'invalid' };
    repo.findOne.mockResolvedValue(null);

    await expect(service.createNode(dto)).rejects.toThrow(NotFoundException);
  });
});
});