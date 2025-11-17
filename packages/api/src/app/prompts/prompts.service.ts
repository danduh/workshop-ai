import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Prompt } from './prompt.entity';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { CreateVersionDto } from './dto/create-version.dto';
import { FilterPromptDto } from './dto/filter-prompt.dto';
import { PaginatedPromptsDto } from './dto/paginated-prompts.dto';

@Injectable()
export class PromptsService {
  constructor(
    @InjectRepository(Prompt)
    private readonly promptRepository: Repository<Prompt>,
  ) {}

  private generateVersion(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
  }

  async create(createPromptDto: CreatePromptDto): Promise<Prompt> {
    // Check if a prompt with this key already exists
    const existingPrompt = await this.promptRepository.findOne({
      where: { 
        prompt_key: createPromptDto.prompt_key,
        deleted_at: IsNull()
      },
    });

    if (existingPrompt) {
      throw new ConflictException(
        `A prompt with key "${createPromptDto.prompt_key}" already exists. Use POST /api/prompts/{promptKey}/versions to create a new version.`
      );
    }

    try {
      const version = this.generateVersion();
      
      const prompt = this.promptRepository.create({
        ...createPromptDto,
        version,
        is_active: true,
        tags: createPromptDto.tags || [],
      });

      return await this.promptRepository.save(prompt);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
        throw new ConflictException('A prompt with this key already exists');
      }
      throw new InternalServerErrorException('Failed to create prompt');
    }
  }

  async findAll(filterDto: FilterPromptDto): Promise<PaginatedPromptsDto> {
    const { model_name, tags, page = 1, limit = 10 } = filterDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.promptRepository.createQueryBuilder('prompt')
      .where('prompt.is_active = :isActive', { isActive: true })
      .andWhere('prompt.deleted_at IS NULL');

    // Apply model_name filter if provided
    if (model_name) {
      queryBuilder.andWhere('prompt.model_name = :model_name', { model_name });
    }

    // Apply tags filter if provided (matches any of the provided tags)
    if (tags && tags.length > 0) {
      queryBuilder.andWhere('prompt.tags && :tags', { tags });
    }

    // Get total count for pagination
    const total = await queryBuilder.getCount();

    // Apply pagination and ordering
    const data = await queryBuilder
      .orderBy('prompt.date_creation', 'DESC')
      .skip(skip)
      .take(limit)
      .getMany();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      total,
      page,
      limit,
      totalPages,
    };
  }

  async findOneByKey(promptKey: string): Promise<Prompt> {
    const prompt = await this.promptRepository.findOne({
      where: {
        prompt_key: promptKey,
        is_active: true,
        deleted_at: IsNull(),
      },
    });

    if (!prompt) {
      throw new NotFoundException(`Active prompt with key "${promptKey}" not found`);
    }

    return prompt;
  }

  async findAllVersions(promptKey: string): Promise<Prompt[]> {
    const versions = await this.promptRepository.find({
      where: {
        prompt_key: promptKey,
        deleted_at: IsNull(),
      },
      order: {
        date_creation: 'DESC',
      },
    });

    if (versions.length === 0) {
      throw new NotFoundException(`No versions found for prompt key "${promptKey}"`);
    }

    return versions;
  }

  async createVersion(promptKey: string, createVersionDto: CreateVersionDto): Promise<Prompt> {
    // Check if the prompt family exists
    const existingPrompt = await this.promptRepository.findOne({
      where: {
        prompt_key: promptKey,
        deleted_at: IsNull(),
      },
    });

    if (!existingPrompt) {
      throw new NotFoundException(
        `Prompt with key "${promptKey}" not found. Use POST /api/prompts to create a new prompt family.`
      );
    }

    try {
      const version = this.generateVersion();

      const prompt = this.promptRepository.create({
        prompt_key: promptKey,
        ...createVersionDto,
        version,
        is_active: false, // New versions are not active by default
        tags: createVersionDto.tags || [],
      });

      return await this.promptRepository.save(prompt);
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
        throw new ConflictException('A version with this timestamp already exists. Please try again.');
      }
      throw new InternalServerErrorException('Failed to create new version');
    }
  }

  async activateVersion(promptKey: string, version: string): Promise<Prompt> {
    // Find the prompt to activate
    const promptToActivate = await this.promptRepository.findOne({
      where: {
        prompt_key: promptKey,
        version,
        deleted_at: IsNull(),
      },
    });

    if (!promptToActivate) {
      throw new NotFoundException(
        `Prompt with key "${promptKey}" and version "${version}" not found or has been deleted`
      );
    }

    // Use a transaction to ensure atomicity
    const queryRunner = this.promptRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Deactivate all other versions of this prompt family
      await queryRunner.manager.update(
        Prompt,
        {
          prompt_key: promptKey,
          deleted_at: IsNull(),
        },
        { is_active: false }
      );

      // Activate the specified version
      await queryRunner.manager.update(
        Prompt,
        {
          id: promptToActivate.id,
        },
        { is_active: true }
      );

      await queryRunner.commitTransaction();

      // Return the updated prompt
      const activatedPrompt = await this.promptRepository.findOne({
        where: { id: promptToActivate.id },
      });

      if (!activatedPrompt) {
        throw new InternalServerErrorException('Failed to retrieve activated prompt');
      }

      return activatedPrompt;
    } catch {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('Failed to activate prompt version');
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: string): Promise<void> {
    const prompt = await this.promptRepository.findOne({
      where: {
        id,
        deleted_at: IsNull(),
      },
    });

    if (!prompt) {
      throw new NotFoundException(`Prompt with id "${id}" not found or already deleted`);
    }

    if (prompt.is_active) {
      throw new BadRequestException('Cannot delete an active prompt. Please deactivate it first.');
    }

    // Soft delete by setting deleted_at timestamp
    prompt.deleted_at = new Date();
    await this.promptRepository.save(prompt);
  }
}
