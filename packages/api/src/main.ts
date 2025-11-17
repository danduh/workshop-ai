/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Workshop AI API')
    .setDescription('The Workshop AI API documentation')
    .setVersion('1.0')
    .addTag('prompts')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  
  // Export Swagger JSON
  const outputPath = path.resolve(process.cwd(), 'api.json');
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
  Logger.log(`📄 Swagger JSON exported to: ${outputPath}`);
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
  Logger.log(
    `📚 Swagger documentation is available at: http://localhost:${port}/${globalPrefix}/docs`
  );
}

bootstrap();
