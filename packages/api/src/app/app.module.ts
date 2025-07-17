import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromptsModule } from '../modules/prompts/prompts.module';
import { HealthController } from '../common/health/health.controller';
import { GlobalExceptionFilter } from '../common/filters/global-exception.filter';
import { databaseConfig, appConfig } from '../config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        Logger.log('Initializing database connection...');
        const dbConfig = configService.get('database');
        Logger.error({...dbConfig});
        return {
          ...configService.get('database'),
          password: configService.get<string>('DB_PASSWORD'),
          autoLoadEntities: true,
          logging: true
        };
      },
    }),
    PromptsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
