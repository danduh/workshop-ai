import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('prompts_ws')
@Index('idx_prompts_key_version', ['promptKey', 'version'], { unique: true })
@Index('idx_prompts_key_active', ['promptKey'], { 
  unique: true, 
  where: 'is_active = true' 
})
@Index('idx_prompts_key', ['promptKey'])
@Index('idx_prompts_model', ['modelName'])
@Index('idx_prompts_tags', ['tags'])
@Index('idx_prompts_created_at', ['createdAt'])
export class PromptEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'prompt_key', type: 'varchar', length: 255 })
  promptKey!: string;

  @Column({ type: 'varchar', length: 50 })
  version!: string;

  @Column({ name: 'is_active', type: 'boolean', default: false })
  isActive!: boolean;

  @Column({ name: 'date_creation', type: 'timestamptz', default: () => 'NOW()' })
  dateCreation!: Date;

  @Column({ name: 'model_name', type: 'varchar', length: 100 })
  modelName!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'jsonb', default: '[]' })
  tags!: string[];

  @Column({ name: 'created_by', type: 'varchar', length: 255 })
  createdBy!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
