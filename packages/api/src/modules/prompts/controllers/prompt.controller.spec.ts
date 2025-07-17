import { Test, TestingModule } from '@nestjs/testing';
import { PromptController } from '../controllers/prompt.controller';
import { PromptService } from '../services/prompt.service';
import { CreatePromptDto, CreateVersionDto, QueryPromptsDto } from '../dto';

describe('PromptController', () => {
  let controller: PromptController;
  let service: jest.Mocked<PromptService>;

  const mockPromptResponse = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    promptKey: 'TEST_PROMPT',
    version: '1.0.0',
    isActive: true,
    dateCreation: new Date('2025-07-17T10:30:00Z'),
    modelName: 'GPT-4o',
    content: 'Test prompt content',
    description: 'Test description',
    tags: ['test', 'example'],
    createdBy: 'test@example.com',
  };

  const mockListResponse = {
    data: [mockPromptResponse],
    pagination: {
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    },
  };

  const mockService = {
    getAllPrompts: jest.fn(),
    getActivePromptByKey: jest.fn(),
    getVersionsByKey: jest.fn(),
    createPrompt: jest.fn(),
    createVersion: jest.fn(),
    activateVersion: jest.fn(),
    deletePrompt: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PromptController],
      providers: [
        {
          provide: PromptService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<PromptController>(PromptController);
    service = module.get(PromptService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPrompts', () => {
    it('should return paginated prompts', async () => {
      const query: QueryPromptsDto = { page: 1, limit: 20 };
      service.getAllPrompts.mockResolvedValue(mockListResponse);

      const result = await controller.getAllPrompts(query);

      expect(service.getAllPrompts).toHaveBeenCalledWith(query);
      expect(result).toEqual(mockListResponse);
    });
  });

  describe('getActivePromptByKey', () => {
    it('should return active prompt by key', async () => {
      service.getActivePromptByKey.mockResolvedValue(mockPromptResponse);

      const result = await controller.getActivePromptByKey('TEST_PROMPT');

      expect(service.getActivePromptByKey).toHaveBeenCalledWith('TEST_PROMPT');
      expect(result).toEqual({ data: mockPromptResponse });
    });
  });

  describe('getVersionsByKey', () => {
    it('should return versions by key', async () => {
      service.getVersionsByKey.mockResolvedValue(mockListResponse);

      const result = await controller.getVersionsByKey('TEST_PROMPT', 1, 20);

      expect(service.getVersionsByKey).toHaveBeenCalledWith('TEST_PROMPT', 1, 20);
      expect(result).toEqual(mockListResponse);
    });

    it('should use default pagination when not provided', async () => {
      service.getVersionsByKey.mockResolvedValue(mockListResponse);

      await controller.getVersionsByKey('TEST_PROMPT');

      expect(service.getVersionsByKey).toHaveBeenCalledWith('TEST_PROMPT', 1, 20);
    });
  });

  describe('createPrompt', () => {
    it('should create a new prompt', async () => {
      const createPromptDto: CreatePromptDto = {
        promptKey: 'NEW_PROMPT',
        version: '1.0.0',
        modelName: 'GPT-4o',
        content: 'New prompt content',
        description: 'New description',
        tags: ['new', 'test'],
        createdBy: 'test@example.com',
        isActive: false,
      };

      service.createPrompt.mockResolvedValue(mockPromptResponse);

      const result = await controller.createPrompt(createPromptDto);

      expect(service.createPrompt).toHaveBeenCalledWith(createPromptDto);
      expect(result).toEqual({ data: mockPromptResponse });
    });
  });

  describe('createVersion', () => {
    it('should create a new version', async () => {
      const createVersionDto: CreateVersionDto = {
        version: '2.0.0',
        modelName: 'GPT-4o',
        content: 'Updated content',
        createdBy: 'test@example.com',
      };

      service.createVersion.mockResolvedValue(mockPromptResponse);

      const result = await controller.createVersion('TEST_PROMPT', createVersionDto);

      expect(service.createVersion).toHaveBeenCalledWith('TEST_PROMPT', createVersionDto);
      expect(result).toEqual({ data: mockPromptResponse });
    });
  });

  describe('activateVersion', () => {
    it('should activate a version', async () => {
      const activatedPrompt = { ...mockPromptResponse, isActive: true };
      service.activateVersion.mockResolvedValue(activatedPrompt);

      const result = await controller.activateVersion('TEST_PROMPT', '1.0.0');

      expect(service.activateVersion).toHaveBeenCalledWith('TEST_PROMPT', '1.0.0');
      expect(result).toEqual({ data: activatedPrompt });
    });
  });

  describe('deletePrompt', () => {
    it('should delete a prompt', async () => {
      service.deletePrompt.mockResolvedValue();

      await controller.deletePrompt('123');

      expect(service.deletePrompt).toHaveBeenCalledWith('123');
    });
  });
});
