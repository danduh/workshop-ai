import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { PromptService } from '../services/prompt.service';
import { PromptRepository } from '../repositories/prompt.repository';
import { PromptEntity } from '../entities/prompt.entity';
import { CreatePromptDto, CreateVersionDto, QueryPromptsDto } from '../dto';

describe('PromptService', () => {
  let service: PromptService;
  let repository: jest.Mocked<PromptRepository>;

  const mockPromptEntity: PromptEntity = {
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
    createdAt: new Date('2025-07-17T10:30:00Z'),
    updatedAt: new Date('2025-07-17T10:30:00Z'),
  };

  const mockRepository = {
    findWithFilters: jest.fn(),
    findActiveByKey: jest.fn(),
    findVersionsByKey: jest.fn(),
    existsByKey: jest.fn(),
    create: jest.fn(),
    existsByKeyAndVersion: jest.fn(),
    findByKeyAndVersion: jest.fn(),
    activateVersion: jest.fn(),
    findById: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromptService,
        {
          provide: PromptRepository,
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<PromptService>(PromptService);
    repository = module.get(PromptRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllPrompts', () => {
    it('should return paginated prompts', async () => {
      const query: QueryPromptsDto = { page: 1, limit: 20 };
      const mockResult = {
        data: [mockPromptEntity],
        total: 1,
        page: 1,
        limit: 20,
        totalPages: 1,
      };

      repository.findWithFilters.mockResolvedValue(mockResult);

      const result = await service.getAllPrompts(query);

      expect(repository.findWithFilters).toHaveBeenCalledWith(query);
      expect(result).toEqual({
        data: [
          {
            id: mockPromptEntity.id,
            promptKey: mockPromptEntity.promptKey,
            version: mockPromptEntity.version,
            isActive: mockPromptEntity.isActive,
            dateCreation: mockPromptEntity.dateCreation,
            modelName: mockPromptEntity.modelName,
            content: mockPromptEntity.content,
            description: mockPromptEntity.description,
            tags: mockPromptEntity.tags,
            createdBy: mockPromptEntity.createdBy,
          },
        ],
        pagination: {
          page: 1,
          limit: 20,
          total: 1,
          totalPages: 1,
        },
      });
    });
  });

  describe('getActivePromptByKey', () => {
    it('should return active prompt when found', async () => {
      repository.findActiveByKey.mockResolvedValue(mockPromptEntity);

      const result = await service.getActivePromptByKey('TEST_PROMPT');

      expect(repository.findActiveByKey).toHaveBeenCalledWith('TEST_PROMPT');
      expect(result.id).toBe(mockPromptEntity.id);
      expect(result.promptKey).toBe(mockPromptEntity.promptKey);
    });

    it('should throw NotFoundException when no active prompt found', async () => {
      repository.findActiveByKey.mockResolvedValue(null);

      await expect(service.getActivePromptByKey('NONEXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createPrompt', () => {
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

    it('should create a new prompt successfully', async () => {
      repository.existsByKey.mockResolvedValue(false);
      repository.create.mockResolvedValue(mockPromptEntity);

      const result = await service.createPrompt(createPromptDto);

      expect(repository.existsByKey).toHaveBeenCalledWith('NEW_PROMPT');
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          promptKey: 'NEW_PROMPT',
          version: '1.0.0',
          modelName: 'GPT-4o',
          content: 'New prompt content',
        }),
      );
      expect(result.promptKey).toBe(mockPromptEntity.promptKey);
    });

    it('should throw ConflictException when prompt key already exists', async () => {
      repository.existsByKey.mockResolvedValue(true);

      await expect(service.createPrompt(createPromptDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should generate timestamp version when not provided', async () => {
      const dtoWithoutVersion = { ...createPromptDto };
      delete dtoWithoutVersion.version;

      repository.existsByKey.mockResolvedValue(false);
      repository.create.mockResolvedValue(mockPromptEntity);

      await service.createPrompt(dtoWithoutVersion);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          version: expect.stringMatching(/^\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2}$/),
        }),
      );
    });
  });

  describe('createVersion', () => {
    const createVersionDto: CreateVersionDto = {
      version: '2.0.0',
      modelName: 'GPT-4o',
      content: 'Updated content',
      createdBy: 'test@example.com',
    };

    it('should create new version successfully', async () => {
      repository.existsByKey.mockResolvedValue(true);
      repository.existsByKeyAndVersion.mockResolvedValue(false);
      repository.create.mockResolvedValue(mockPromptEntity);

      const result = await service.createVersion('TEST_PROMPT', createVersionDto);

      expect(repository.existsByKey).toHaveBeenCalledWith('TEST_PROMPT');
      expect(repository.existsByKeyAndVersion).toHaveBeenCalledWith('TEST_PROMPT', '2.0.0');
      expect(result.promptKey).toBe(mockPromptEntity.promptKey);
    });

    it('should throw NotFoundException when prompt key does not exist', async () => {
      repository.existsByKey.mockResolvedValue(false);

      await expect(
        service.createVersion('NONEXISTENT', createVersionDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException when version already exists', async () => {
      repository.existsByKey.mockResolvedValue(true);
      repository.existsByKeyAndVersion.mockResolvedValue(true);

      await expect(
        service.createVersion('TEST_PROMPT', createVersionDto),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('activateVersion', () => {
    it('should activate version successfully', async () => {
      repository.findByKeyAndVersion.mockResolvedValue(mockPromptEntity);
      repository.activateVersion.mockResolvedValue({
        ...mockPromptEntity,
        isActive: true,
      });

      const result = await service.activateVersion('TEST_PROMPT', '1.0.0');

      expect(repository.findByKeyAndVersion).toHaveBeenCalledWith('TEST_PROMPT', '1.0.0');
      expect(repository.activateVersion).toHaveBeenCalledWith('TEST_PROMPT', '1.0.0');
      expect(result.isActive).toBe(true);
    });

    it('should throw NotFoundException when version does not exist', async () => {
      repository.findByKeyAndVersion.mockResolvedValue(null);

      await expect(
        service.activateVersion('NONEXISTENT', '1.0.0'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deletePrompt', () => {
    it('should delete inactive prompt successfully', async () => {
      const inactivePrompt = { ...mockPromptEntity, isActive: false };
      repository.findById.mockResolvedValue(inactivePrompt);

      await service.deletePrompt('123');

      expect(repository.findById).toHaveBeenCalledWith('123');
      expect(repository.delete).toHaveBeenCalledWith('123');
    });

    it('should throw NotFoundException when prompt does not exist', async () => {
      repository.findById.mockResolvedValue(null);

      await expect(service.deletePrompt('NONEXISTENT')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException when trying to delete active prompt', async () => {
      repository.findById.mockResolvedValue(mockPromptEntity);

      await expect(service.deletePrompt('123')).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
