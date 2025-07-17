import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PromptResponseDto {
  @ApiProperty({
    description: 'Unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id!: string;

  @ApiProperty({
    description: 'Unique key for the prompt',
    example: 'CUSTOMER_SUPPORT_AGENT',
  })
  promptKey!: string;

  @ApiProperty({
    description: 'Version of the prompt',
    example: '1.0.0',
  })
  version!: string;

  @ApiProperty({
    description: 'Whether this version is active',
    example: true,
  })
  isActive!: boolean;

  @ApiProperty({
    description: 'Creation date of the prompt',
    example: '2025-07-17T10:30:00Z',
  })
  dateCreation!: Date;

  @ApiProperty({
    description: 'Model name for which this prompt is designed',
    example: 'GPT-4o',
  })
  modelName!: string;

  @ApiProperty({
    description: 'The actual prompt content',
    example: 'You are a helpful customer support agent...',
  })
  content!: string;

  @ApiPropertyOptional({
    description: 'Description of the prompt',
    example: 'Primary customer support prompt',
  })
  description?: string;

  @ApiProperty({
    description: 'Tags associated with the prompt',
    example: ['support', 'customer-service'],
    type: [String],
  })
  tags!: string[];

  @ApiProperty({
    description: 'Creator of the prompt',
    example: 'john.doe@company.com',
  })
  createdBy!: string;
}

export class PaginationDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page!: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 20,
  })
  limit!: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 150,
  })
  total!: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 8,
  })
  totalPages!: number;
}

export class PromptListResponseDto {
  @ApiProperty({
    description: 'List of prompts',
    type: [PromptResponseDto],
  })
  data!: PromptResponseDto[];

  @ApiProperty({
    description: 'Pagination information',
    type: PaginationDto,
  })
  pagination!: PaginationDto;
}

export class PromptSingleResponseDto {
  @ApiProperty({
    description: 'Prompt data',
    type: PromptResponseDto,
  })
  data!: PromptResponseDto;
}
