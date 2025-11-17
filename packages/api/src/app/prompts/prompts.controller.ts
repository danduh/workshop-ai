import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { PromptsService } from './prompts.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { Prompt } from './prompt.entity';

@ApiTags('prompts')
@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new prompt' })
  @ApiBody({ type: CreatePromptDto })
  @ApiResponse({ status: 201, description: 'The prompt has been successfully created.', type: Prompt })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createPromptDto: CreatePromptDto): Promise<Prompt> {
    return await this.promptsService.create(createPromptDto);
  }
}
