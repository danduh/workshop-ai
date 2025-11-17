import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity({ name: 'prompts_daniel' })
@Index(['prompt_key', 'version'], { unique: true })
@Index(['prompt_key'], { where: `"is_active" = true AND "deleted_at" IS NULL`, unique: true })
export class Prompt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  prompt_key: string;

  @Column({ type: 'varchar', length: 50 })
  version: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  date_creation: Date;

  @Column({ type: 'varchar', length: 100 })
  model_name: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'jsonb', nullable: true, default: [] })
  tags: string[];

  @Column({ type: 'varchar', length: 255 })
  created_by: string;

  @Column({ type: 'timestamptz', nullable: true })
  deleted_at: Date;
}
