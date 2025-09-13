import { Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '..', '.env') });

import { GlobalExceptionFilter } from './utils/index';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { securityMiddleware } from 'module/middleware/security.middleware';
import { instanceMongodb } from './module/database/init.mongodb';

async function bootstrap() {
  // Kết nối Mongo Atlas ngay khi khởi động
  console.log('🔄 Initializing MongoDB Atlas connection...');
  instanceMongodb;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();

  app.setGlobalPrefix('v1/api');

  // CORS
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL || 'https://your-frontend-domain.com']
      : ['http://localhost:3000', 'http://localhost:3001'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  });

  // Middleware & bảo mật
  securityMiddleware().forEach((mw) => expressApp.use(mw));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.use(cookieParser());
  app.use(helmet());

  // Swagger docs
  const config = new DocumentBuilder()
    .setTitle('Social Network API')
    .setDescription('API description for social network')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // Static upload
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  // Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Render yêu cầu listen 0.0.0.0
  const port = process.env.PORT || 5000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Application is running on port: ${port}`);
}
bootstrap();
