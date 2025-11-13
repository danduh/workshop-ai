/**
 * System Prompt Management Backend Service
 * A RESTful API service for centralized management of versioned system prompts
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Global configuration
  const globalPrefix = configService.get('app.globalPrefix', 'api');
  const port = configService.get('app.port', 3000);
  const version = configService.get('app.version', '1.0.0');
  
  app.setGlobalPrefix(globalPrefix);
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // CORS configuration
  app.enableCors({
    origin: ['*'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Allow cookies to be sent
  });
  
  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('System Prompt Management API')
    .setDescription('RESTful API for centralized management of versioned system prompts for AI applications')
    .setVersion(version)
    .addTag('prompts', 'Prompt management endpoints')
    .addTag('health', 'Health check endpoints')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document, {
    jsonDocumentUrl: `${globalPrefix}/json`,
    customSiteTitle: 'Prompt Management API Documentation',
    customfavIcon: '/favicon.ico',
    customCss: '.swagger-ui .topbar { display: none }',
  });
  
  await app.listen(port);
  
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `📚 API Documentation available at: http://localhost:${port}/${globalPrefix}/docs`,
  );
}

bootstrap().catch((error) => {
  Logger.error('Failed to start application', error);
  process.exit(1);
});
