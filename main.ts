import { Module, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { join } from 'path';

const envPath = join(__dirname, '..', '.env');
console.log('Loading .env from:', envPath);
dotenv.config({ path: envPath });

import { AllExceptionsFilter } from './utils/asyncHandler';
import { checkOverload, countConnect } from './module/helpers/check.connect';
import { GlobalExceptionFilter } from './utils/index';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as helmet from 'helmet';
import { securityMiddleware } from 'module/middleware/security.middleware';



async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    const expressApp = app.getHttpAdapter().getInstance();

    app.setGlobalPrefix('v1/api');
    
    // CORS configuration for production
    const allowedOrigins = process.env.NODE_ENV === 'production' 
        ? [process.env.FRONTEND_URL || 'https://your-frontend-domain.com']
        : ['http://localhost:3000', 'http://localhost:3001'];
    
    app.enableCors({
        origin: allowedOrigins,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    });
    
    securityMiddleware().forEach((mw) => expressApp.use(mw));
    app.useGlobalFilters(new GlobalExceptionFilter());
    app.use(cookieParser());
    const config = new DocumentBuilder()
        .setTitle('Social Network API')
        .setDescription('API description for social network')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
    app.useStaticAssets(join(__dirname, '..', 'uploads'), {
        prefix: '/uploads',
    });
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true, 
        }),
    );

    // Use dynamic port for Render
    const port = process.env.PORT || 5000;
    await app.listen(port);
    console.log(`🚀 Application is running on: http://localhost:${port}`);
}
bootstrap();




