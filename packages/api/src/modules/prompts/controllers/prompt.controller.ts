import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ValidationPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { PromptService } from '../services/prompt.service';
import {
  CreatePromptDto,
  CreateVersionDto,
  QueryPromptsDto,
  PromptListResponseDto,
  PromptSingleResponseDto,
} from '../dto';

@ApiTags('prompts')
@Controller('prompts')
export class PromptController {
  constructor(private readonly promptService: PromptService) {}

  @Get()
  @ApiOperation({ summary: 'Get all prompts with filtering and pagination' })
  @ApiResponse({
    status: 200,
    description: 'List of prompts retrieved successfully',
    type: PromptListResponseDto,
  })
  async getAllPrompts(
    @Query(new ValidationPipe({ transform: true })) query: QueryPromptsDto,
  ): Promise<PromptListResponseDto> {
    return this.promptService.getAllPrompts(query);
  }

  @Get(':promptKey')
  @ApiOperation({ summary: 'Get active prompt by key' })
  @ApiParam({
    name: 'promptKey',
    description: 'The unique key of the prompt',
    example: 'CUSTOMER_SUPPORT_AGENT',
  })
  @ApiResponse({
    status: 200,
    description: 'Active prompt retrieved successfully',
    type: PromptSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No active prompt found with the given key',
  })
  async getActivePromptByKey(
    @Param('promptKey') promptKey: string,
  ): Promise<PromptSingleResponseDto> {
    const data = await this.promptService.getActivePromptByKey(promptKey);
    return { data };
  }

  @Get(':promptKey/versions')
  @ApiOperation({ summary: 'Get all versions of a prompt' })
  @ApiParam({
    name: 'promptKey',
    description: 'The unique key of the prompt',
    example: 'CUSTOMER_SUPPORT_AGENT',
  })
  @ApiQuery({
    name: 'page',
    description: 'Page number',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    required: false,
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'Prompt versions retrieved successfully',
    type: PromptListResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Prompt not found',
  })
  async getVersionsByKey(
    @Param('promptKey') promptKey: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ): Promise<PromptListResponseDto> {
    return this.promptService.getVersionsByKey(
      promptKey,
      page || 1,
      limit || 20,
    );
  }

  @Get(':promptKey/versions/:version')
  @ApiOperation({ summary: 'Get a specific version of a prompt' })
  @ApiParam({
    name: 'promptKey',
    description: 'The unique key of the prompt',
    example: 'CUSTOMER_SUPPORT_AGENT',
  })
  @ApiParam({
    name: 'version',
    description: 'The version of the prompt',
    example: '1.0.0',
  })
  @ApiResponse({
    status: 200,
    description: 'Prompt version retrieved successfully',
    type: PromptSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Prompt version not found',
  })
  async getPromptVersion(
    @Param('promptKey') promptKey: string,
    @Param('version') version: string,
  ): Promise<PromptSingleResponseDto> {
    const data = await this.promptService.getPromptVersion(promptKey, version);
    return { data };
  }

  @Post()
  @ApiOperation({ summary: 'Create a new prompt' })
  @ApiResponse({
    status: 201,
    description: 'Prompt created successfully',
    type: PromptSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 409,
    description: 'Prompt with the given key already exists',
  })
  async createPrompt(
    @Body() createPromptDto: CreatePromptDto,
  ): Promise<PromptSingleResponseDto> {
    const data = await this.promptService.createPrompt(createPromptDto);
    return { data };
  }

  @Post(':promptKey/versions')
  @ApiOperation({ summary: 'Create a new version of an existing prompt' })
  @ApiParam({
    name: 'promptKey',
    description: 'The unique key of the prompt',
    example: 'CUSTOMER_SUPPORT_AGENT',
  })
  @ApiResponse({
    status: 201,
    description: 'Prompt version created successfully',
    type: PromptSingleResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data',
  })
  @ApiResponse({
    status: 404,
    description: 'Prompt not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Version already exists',
  })
  async createVersion(
    @Param('promptKey') promptKey: string,
    @Body() createVersionDto: CreateVersionDto,
  ): Promise<PromptSingleResponseDto> {
    const data = await this.promptService.createVersion(promptKey, createVersionDto);
    return { data };
  }

  @Patch(':promptKey/activate/:version')
  @ApiOperation({ summary: 'Activate a specific version of a prompt' })
  @ApiParam({
    name: 'promptKey',
    description: 'The unique key of the prompt',
    example: 'CUSTOMER_SUPPORT_AGENT',
  })
  @ApiParam({
    name: 'version',
    description: 'The version to activate',
    example: '1.0.0',
  })
  @ApiResponse({
    status: 200,
    description: 'Prompt version activated successfully',
    type: PromptSingleResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Prompt or version not found',
  })
  async activateVersion(
    @Param('promptKey') promptKey: string,
    @Param('version') version: string,
  ): Promise<PromptSingleResponseDto> {
    const data = await this.promptService.activateVersion(promptKey, version);
    return { data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a prompt' })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the prompt',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 204,
    description: 'Prompt deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Prompt not found',
  })
  @ApiResponse({
    status: 409,
    description: 'Cannot delete active prompt',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePrompt(@Param('id') id: string): Promise<void> {
    await this.promptService.deletePrompt(id);
  }
}
