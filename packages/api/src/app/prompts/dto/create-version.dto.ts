import { IsString, IsNotEmpty, IsOptional, IsArray, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVersionDto {
  @ApiProperty({
    description: 'Name of the AI model to use',
    example: 'gpt-4',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  model_name: string;

  @ApiProperty({
    description: 'The content/template of the prompt',
    example: 'You are a helpful assistant. Please help with: {{task}}',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Optional description of the prompt',
    example: 'A general-purpose assistant prompt',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Optional tags for categorizing the prompt',
    example: ['assistant', 'general'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'User identifier who created this version',
    example: 'john.doe@example.com',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  created_by: string;
}
