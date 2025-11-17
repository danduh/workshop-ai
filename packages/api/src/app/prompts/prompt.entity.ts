import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'prompts_daniel' })
@Index(['prompt_key', 'version'], { unique: true })
@Index('idx_active_prompt_key', ['prompt_key'], { 
  unique: true,
  where: '"is_active" = true AND "deleted_at" IS NULL'
})
export class Prompt {
  @ApiProperty({ description: 'Unique identifier (UUID)', example: '123e4567-e89b-12d3-a456-426614174000' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Prompt key identifier', example: 'my-prompt-key' })
  @Column({ type: 'varchar', length: 255 })
  prompt_key: string;

  @ApiProperty({ description: 'Version number', example: 'v1.0.0' })
  @Column({ type: 'varchar', length: 50 })
  version: string;

  @ApiProperty({ description: 'Whether this version is active', example: true })
  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @ApiProperty({ description: 'Creation timestamp', example: '2025-11-17T10:00:00Z' })
  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;

  @ApiProperty({ description: 'AI model name', example: 'gpt-4' })
  @Column({ type: 'varchar', length: 100 })
  model_name: string;

  @ApiProperty({ description: 'Prompt content/template', example: 'You are a helpful assistant.' })
  @Column({ type: 'text' })
  content: string;

  @ApiProperty({ description: 'Optional prompt description', example: 'General assistant prompt', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ description: 'Tags for categorization', example: ['assistant', 'general'], required: false, type: [String] })
  @Column({ type: 'jsonb', nullable: true })
  tags: string[];

  @ApiProperty({ description: 'User who created the prompt', example: 'user@example.com' })
  @Column({ type: 'varchar', length: 255 })
  created_by: string;

  @ApiProperty({ description: 'Soft delete timestamp', example: null, required: false })
  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date;
}
