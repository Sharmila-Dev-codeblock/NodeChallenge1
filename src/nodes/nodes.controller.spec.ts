import { Test, TestingModule } from '@nestjs/testing';
import { NodesController } from './nodes.controller';
import { NodesService } from './nodes.service';

describe('NodesController', () => {
  let controller: NodesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NodesController],
      providers: [
        {
          provide: NodesService,
          useValue: {
            getSubtreeByParentId: jest.fn(),
            getRootSubtree: jest.fn(),
            getRootSubtrees: jest.fn(),
            createNode: jest.fn(),
            addProperty: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NodesController>(NodesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
