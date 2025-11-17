import { IsString, IsNotEmpty, IsOptional, IsArray, MaxLength, Matches } from 'class-validator';

export class CreatePromptDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Matches(/^[a-z0-9_-]+$/, {
    message: 'prompt_key must contain only lowercase letters, numbers, hyphens, and underscores',
  })
  prompt_key: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  model_name: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  created_by: string;
}
