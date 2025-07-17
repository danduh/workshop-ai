import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { PromptEntity } from '../modules/prompts/entities/prompt.entity';
import { Logger } from '@nestjs/common';

export const createDataSource = (configService: ConfigService): DataSource => {
  const dbConfig = configService.get('database');
  Logger.error('Database configuration:', dbConfig);

  return new DataSource({
    type: 'postgres',
    host: dbConfig.host,
    port: dbConfig.port,
    username: dbConfig.username,
    password: dbConfig.password,
    database: dbConfig.database,
    entities: [PromptEntity],
    migrations: ['migrations/*.sql'],
    synchronize: dbConfig.synchronize,
    logging: dbConfig.logging,
    ssl: dbConfig.ssl,
  });
};
