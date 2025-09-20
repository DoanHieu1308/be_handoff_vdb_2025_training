import { Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { Request, Response } from 'express';

dotenv.config({ path: join(__dirname, '..', '.env') });

import { GlobalExceptionFilter } from './utils/index';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { securityMiddleware } from 'module/middleware/security.middleware';
import { instanceMongodb } from './module/database/init.mongodb';

let cachedApp: any;

async function bootstrap() {
  if (cachedApp) {
    return cachedApp;
  }

  // Kết nối Mongo Atlas ngay khi khởi động
  console.log('🔄 Initializing MongoDB Atlas connection...');
  instanceMongodb;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const expressApp = app.getHttpAdapter().getInstance();
  
  // Trust proxy for Vercel/Render.com (fixes X-Forwarded-For error)
  app.set('trust proxy', 1);

  app.setGlobalPrefix('v1/api');

  // Health check route
  app.getHttpAdapter().get('/', (req: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Social Network API is running',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // CORS
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL || 'https://your-frontend-domain.com']
      : ['http://localhost:3000', 'http://localhost:3001'];

  app.enableCors({
    origin: "*",
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

  // Initialize app for Vercel serverless
  await app.init();
  cachedApp = app;
  return app;
}

// For Vercel serverless
export default async (req: any, res: any) => {
  const app = await bootstrap();
  const handler = app.getHttpAdapter().getInstance();
  return handler(req, res);
};

// For traditional server deployment
if (process.env.NODE_ENV !== 'vercel') {
  bootstrap().then(async (app) => {
    app.enable('trust proxy');
    const port = process.env.PORT || 5000;
    await app.listen(port, '0.0.0.0');
    console.log(`🚀 Application is running on port: ${port}`);
  });
}
