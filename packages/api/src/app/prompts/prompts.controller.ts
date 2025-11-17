import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { PromptsService } from './prompts.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { Prompt } from './prompt.entity';

@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPromptDto: CreatePromptDto): Promise<Prompt> {
    return await this.promptsService.create(createPromptDto);
  }
}
