import { Injectable, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Prompt } from './prompt.entity';
import { CreatePromptDto } from './dto/create-prompt.dto';

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
}
