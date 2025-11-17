import { IsOptional, IsString, IsInt, Min, Max, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FilterPromptDto {
  @ApiPropertyOptional({
    description: 'Filter by model name',
    example: 'gpt-4',
  })
  @IsOptional()
  @IsString()
  model_name?: string;

  @ApiPropertyOptional({
    description: 'Filter by tags (array of tag strings)',
    example: ['assistant', 'general'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    example: 1,
    minimum: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
    minimum: 1,
    maximum: 100,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
