import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PromptEntity } from '../entities/prompt.entity';
import { QueryPromptsDto } from '../dto';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class PromptRepository {
  constructor(
    @InjectRepository(PromptEntity)
    private readonly repository: Repository<PromptEntity>,
  ) {}

  async create(prompt: Partial<PromptEntity>): Promise<PromptEntity> {
    const entity = this.repository.create(prompt);
    return this.repository.save(entity);
  }

  async findById(id: string): Promise<PromptEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findActiveByKey(promptKey: string): Promise<PromptEntity | null> {
    return this.repository.findOne({
      where: { promptKey, isActive: true },
    });
  }

  async findByKeyAndVersion(
    promptKey: string,
    version: string,
  ): Promise<PromptEntity | null> {
    return this.repository.findOne({
      where: { promptKey, version },
    });
  }

  async findVersionsByKey(
    promptKey: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResult<PromptEntity>> {
    const skip = (page - 1) * limit;
    
    const [data, total] = await this.repository.findAndCount({
      where: { promptKey },
      order: { dateCreation: 'DESC' },
      skip,
      take: limit,
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findWithFilters(query: QueryPromptsDto): Promise<PaginatedResult<PromptEntity>> {
    const { page = 1, limit = 20, sortBy = 'dateCreation', sortOrder = 'desc' } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('prompt');

    // Apply filters
    if (query.promptKey) {
      queryBuilder.andWhere('prompt.promptKey ILIKE :promptKey', {
        promptKey: `%${query.promptKey}%`,
      });
    }

    if (query.modelName) {
      queryBuilder.andWhere('prompt.modelName = :modelName', {
        modelName: query.modelName,
      });
    }

    if (query.isActive !== undefined) {
      queryBuilder.andWhere('prompt.isActive = :isActive', {
        isActive: query.isActive,
      });
    }

    if (query.createdBy) {
      queryBuilder.andWhere('prompt.createdBy ILIKE :createdBy', {
        createdBy: `%${query.createdBy}%`,
      });
    }

    if (query.tags && query.tags.length > 0) {
      queryBuilder.andWhere('prompt.tags ?| array[:...tags]', {
        tags: query.tags,
      });
    }

    // Apply sorting
    const sortField = this.mapSortField(sortBy);
    queryBuilder.orderBy(`prompt.${sortField}`, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    // Apply pagination
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(id: string, updates: Partial<PromptEntity>): Promise<PromptEntity | null> {
    await this.repository.update(id, updates);
    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deactivateAllVersionsOfKey(promptKey: string): Promise<void> {
    await this.repository.update(
      { promptKey, isActive: true },
      { isActive: false },
    );
  }

  async activateVersion(promptKey: string, version: string): Promise<PromptEntity | null> {
    // First deactivate all versions of this prompt key
    await this.deactivateAllVersionsOfKey(promptKey);
    
    // Then activate the specified version
    await this.repository.update(
      { promptKey, version },
      { isActive: true },
    );

    return this.findByKeyAndVersion(promptKey, version);
  }

  async existsByKeyAndVersion(promptKey: string, version: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { promptKey, version },
    });
    return count > 0;
  }

  async existsByKey(promptKey: string): Promise<boolean> {
    const count = await this.repository.count({
      where: { promptKey },
    });
    return count > 0;
  }

  private mapSortField(sortBy: string): string {
    const fieldMap: Record<string, string> = {
      dateCreation: 'dateCreation',
      promptKey: 'promptKey',
      version: 'version',
    };
    return fieldMap[sortBy] || 'dateCreation';
  }
}
