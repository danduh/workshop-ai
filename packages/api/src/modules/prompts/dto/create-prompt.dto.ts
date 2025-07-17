import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsArray,
  IsOptional,
  Length,
  MaxLength,
  ArrayMaxSize,
  Matches,
  IsIn,
} from 'class-validator';

const SUPPORTED_MODELS = [
  'GPT-4o',
  'GPT-4',
  'GPT-3.5-turbo',
  'Claude-3',
  'Claude-2',
  'Gemini-Pro',
] as const;

export class CreatePromptDto {
  @ApiProperty({
    description: 'Unique key for the prompt',
    example: 'CUSTOMER_SUPPORT_AGENT',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @Length(3, 100)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'promptKey must contain only alphanumeric characters, underscores, and hyphens',
  })
  promptKey!: string;

  @ApiPropertyOptional({
    description: 'Version of the prompt (semantic versioning or timestamp-based)',
    example: '1.0.0',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  version?: string;

  @ApiProperty({
    description: 'Model name for which this prompt is designed',
    example: 'GPT-4o',
    enum: SUPPORTED_MODELS,
  })
  @IsString()
  @IsIn(SUPPORTED_MODELS, {
    message: `modelName must be one of: ${SUPPORTED_MODELS.join(', ')}`,
  })
  modelName!: string;

  @ApiProperty({
    description: 'The actual prompt content',
    example: 'You are a helpful customer support agent...',
    maxLength: 50000,
  })
  @IsString()
  @Length(1, 50000)
  content!: string;

  @ApiPropertyOptional({
    description: 'Description of the prompt',
    example: 'Primary customer support prompt',
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({
    description: 'Tags associated with the prompt',
    example: ['support', 'customer-service'],
    type: [String],
    maxItems: 20,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(20)
  @Length(1, 50, { each: true })
  tags?: string[];

  @ApiProperty({
    description: 'Creator of the prompt',
    example: 'john.doe@company.com',
    maxLength: 255,
  })
  @IsString()
  @Length(1, 255)
  createdBy!: string;

  @ApiPropertyOptional({
    description: 'Whether this version should be active',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
