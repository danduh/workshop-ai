import { Controller, Post, Get, Patch, Delete, Body, Query, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
import { PromptsService } from './prompts.service';
import { CreatePromptDto } from './dto/create-prompt.dto';
import { CreateVersionDto } from './dto/create-version.dto';
import { FilterPromptDto } from './dto/filter-prompt.dto';
import { PaginatedPromptsDto } from './dto/paginated-prompts.dto';
import { Prompt } from './prompt.entity';

@ApiTags('prompts')
@Controller('prompts')
export class PromptsController {
  constructor(private readonly promptsService: PromptsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all active prompts with filtering and pagination' })
  @ApiResponse({ status: 200, description: 'Returns paginated list of active prompts.', type: PaginatedPromptsDto })
  async findAll(@Query() filterDto: FilterPromptDto): Promise<PaginatedPromptsDto> {
    return await this.promptsService.findAll(filterDto);
  }

  @Get(':promptKey')
  @ApiOperation({ summary: 'Get active prompt by prompt key' })
  @ApiParam({ name: 'promptKey', description: 'The prompt key identifier', example: 'my-prompt-key' })
  @ApiResponse({ status: 200, description: 'Returns the active prompt.', type: Prompt })
  @ApiResponse({ status: 404, description: 'Prompt not found.' })
  async findOneByKey(@Param('promptKey') promptKey: string): Promise<Prompt> {
    return await this.promptsService.findOneByKey(promptKey);
  }

  @Get(':promptKey/versions')
  @ApiOperation({ summary: 'Get all versions of a prompt family' })
  @ApiParam({ name: 'promptKey', description: 'The prompt key identifier', example: 'my-prompt-key' })
  @ApiResponse({ status: 200, description: 'Returns all versions of the prompt family.', type: [Prompt] })
  @ApiResponse({ status: 404, description: 'No versions found.' })
  async findAllVersions(@Param('promptKey') promptKey: string): Promise<Prompt[]> {
    return await this.promptsService.findAllVersions(promptKey);
  }

  @Post(':promptKey/versions')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new version of an existing prompt' })
  @ApiParam({ name: 'promptKey', description: 'The prompt key identifier', example: 'my-prompt-key' })
  @ApiBody({ type: CreateVersionDto })
  @ApiResponse({ status: 201, description: 'The new version has been successfully created.', type: Prompt })
  @ApiResponse({ status: 404, description: 'Prompt family not found.' })
  @ApiResponse({ status: 409, description: 'Version conflict.' })
  async createVersion(
    @Param('promptKey') promptKey: string,
    @Body() createVersionDto: CreateVersionDto
  ): Promise<Prompt> {
    return await this.promptsService.createVersion(promptKey, createVersionDto);
  }

  @Patch(':promptKey/activate/:version')
  @ApiOperation({ summary: 'Activate a specific version of a prompt' })
  @ApiParam({ name: 'promptKey', description: 'The prompt key identifier', example: 'my-prompt-key' })
  @ApiParam({ name: 'version', description: 'The version to activate', example: '2025-11-17-14-30-25' })
  @ApiResponse({ status: 200, description: 'The version has been successfully activated.', type: Prompt })
  @ApiResponse({ status: 404, description: 'Prompt or version not found.' })
  async activateVersion(
    @Param('promptKey') promptKey: string,
    @Param('version') version: string
  ): Promise<Prompt> {
    return await this.promptsService.activateVersion(promptKey, version);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new prompt' })
  @ApiBody({ type: CreatePromptDto })
  @ApiResponse({ status: 201, description: 'The prompt has been successfully created.', type: Prompt })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createPromptDto: CreatePromptDto): Promise<Prompt> {
    return await this.promptsService.create(createPromptDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft delete a prompt (inactive prompts only)' })
  @ApiParam({ name: 'id', description: 'The prompt UUID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @ApiResponse({ status: 204, description: 'The prompt has been successfully deleted.' })
  @ApiResponse({ status: 400, description: 'Cannot delete an active prompt.' })
  @ApiResponse({ status: 404, description: 'Prompt not found.' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.promptsService.remove(id);
  }
}
