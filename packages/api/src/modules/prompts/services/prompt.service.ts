import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PromptRepository } from '../repositories/prompt.repository';
import { PromptEntity } from '../entities/prompt.entity';
import {
  CreatePromptDto,
  CreateVersionDto,
  QueryPromptsDto,
  PromptResponseDto,
  PromptListResponseDto,
} from '../dto';

@Injectable()
export class PromptService {
  constructor(private readonly promptRepository: PromptRepository) {}

  async getAllPrompts(query: QueryPromptsDto): Promise<PromptListResponseDto> {
    const result = await this.promptRepository.findWithFilters(query);
    
    return {
      data: result.data.map(this.mapToResponseDto),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  async getActivePromptByKey(promptKey: string): Promise<PromptResponseDto> {
    const prompt = await this.promptRepository.findActiveByKey(promptKey);
    
    if (!prompt) {
      throw new NotFoundException(`No active prompt found with key: ${promptKey}`);
    }
    
    return this.mapToResponseDto(prompt);
  }

  async getPromptVersion(promptKey: string, version: string): Promise<PromptResponseDto> {
    const prompt = await this.promptRepository.findByKeyAndVersion(promptKey, version);
    
    if (!prompt) {
      throw new NotFoundException(`Prompt with key '${promptKey}' and version '${version}' not found`);
    }
    
    return this.mapToResponseDto(prompt);
  }

  async getVersionsByKey(
    promptKey: string,
    page = 1,
    limit = 20,
  ): Promise<PromptListResponseDto> {
    // Check if prompt key exists
    const exists = await this.promptRepository.existsByKey(promptKey);
    if (!exists) {
      throw new NotFoundException(`Prompt with key '${promptKey}' not found`);
    }

    const result = await this.promptRepository.findVersionsByKey(promptKey, page, limit);
    
    return {
      data: result.data.map(this.mapToResponseDto),
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      },
    };
  }

  async createPrompt(createPromptDto: CreatePromptDto): Promise<PromptResponseDto> {
    const { promptKey, version: providedVersion, ...rest } = createPromptDto;

    // Check if prompt key already exists
    const existingPrompt = await this.promptRepository.existsByKey(promptKey);
    if (existingPrompt) {
      throw new ConflictException(`Prompt with key '${promptKey}' already exists. Use createVersion to add new versions.`);
    }

    // Generate version if not provided
    const version = providedVersion || this.generateTimestampVersion();

    // Validate that if isActive is true, no other version is active
    if (createPromptDto.isActive) {
      const activePrompt = await this.promptRepository.findActiveByKey(promptKey);
      if (activePrompt) {
        throw new ConflictException(`Another version of prompt '${promptKey}' is already active`);
      }
    }

    const promptData: Partial<PromptEntity> = {
      promptKey,
      version,
      dateCreation: new Date(),
      tags: createPromptDto.tags || [],
      ...rest,
    };

    const createdPrompt = await this.promptRepository.create(promptData);
    return this.mapToResponseDto(createdPrompt);
  }

  async createVersion(
    promptKey: string,
    createVersionDto: CreateVersionDto,
  ): Promise<PromptResponseDto> {
    // Check if prompt key exists
    const exists = await this.promptRepository.existsByKey(promptKey);
    if (!exists) {
      throw new NotFoundException(`Prompt with key '${promptKey}' not found`);
    }

    // Check if version already exists
    const existingVersion = await this.promptRepository.existsByKeyAndVersion(
      promptKey,
      createVersionDto.version,
    );
    if (existingVersion) {
      throw new ConflictException(
        `Version '${createVersionDto.version}' already exists for prompt '${promptKey}'`,
      );
    }

    const versionData: Partial<PromptEntity> = {
      promptKey,
      dateCreation: new Date(),
      tags: createVersionDto.tags || [],
      ...createVersionDto,
    };

    const createdVersion = await this.promptRepository.create(versionData);
    return this.mapToResponseDto(createdVersion);
  }

  async activateVersion(
    promptKey: string,
    version: string,
  ): Promise<PromptResponseDto> {
    // Check if the specific version exists
    const prompt = await this.promptRepository.findByKeyAndVersion(promptKey, version);
    if (!prompt) {
      throw new NotFoundException(
        `Prompt with key '${promptKey}' and version '${version}' not found`,
      );
    }

    const activatedPrompt = await this.promptRepository.activateVersion(promptKey, version);
    if (!activatedPrompt) {
      throw new Error('Failed to activate prompt version');
    }

    return this.mapToResponseDto(activatedPrompt);
  }

  async deletePrompt(id: string): Promise<void> {
    const prompt = await this.promptRepository.findById(id);
    if (!prompt) {
      throw new NotFoundException(`Prompt with id '${id}' not found`);
    }

    if (prompt.isActive) {
      throw new ConflictException('Cannot delete an active prompt. Deactivate it first.');
    }

    await this.promptRepository.delete(id);
  }

  private mapToResponseDto(prompt: PromptEntity): PromptResponseDto {
    return {
      id: prompt.id,
      promptKey: prompt.promptKey,
      version: prompt.version,
      isActive: prompt.isActive,
      dateCreation: prompt.dateCreation,
      modelName: prompt.modelName,
      content: prompt.content,
      description: prompt.description,
      tags: prompt.tags,
      createdBy: prompt.createdBy,
    };
  }

  private generateTimestampVersion(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
  }
}
