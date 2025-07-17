import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptEntity } from './entities/prompt.entity';
import { PromptController } from './controllers/prompt.controller';
import { PromptService } from './services/prompt.service';
import { PromptRepository } from './repositories/prompt.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PromptEntity])],
  controllers: [PromptController],
  providers: [PromptService, PromptRepository],
  exports: [PromptService],
})
export class PromptsModule {}
