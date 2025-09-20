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
  try {
    instanceMongodb;
    console.log('✅ MongoDB connection initialized');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('❌ MongoDB error details:', {
      message: error.message,
      name: error.name,
      code: error.code
    });
    // Không crash function, chỉ log error
  }

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

  // Static upload (chỉ khi folder tồn tại)
  try {
    const uploadsPath = join(__dirname, '..', 'uploads');
    app.useStaticAssets(uploadsPath, {
      prefix: '/uploads',
    });
  } catch (error) {
    console.log('⚠️ Uploads folder not found, skipping static assets');
  }

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
  try {
    console.log('🚀 Function started - Method:', req.method, 'URL:', req.url);
    const app = await bootstrap();
    console.log('✅ App initialized successfully');
    const handler = app.getHttpAdapter().getInstance();
    console.log('✅ Handler created successfully');
    return handler(req, res);
  } catch (error) {
    console.error('❌ Function error:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error details:', {
      message: error.message,
      name: error.name,
      code: error.code
    });
    
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-vercel-id'] || 'unknown'
    });
  }
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
