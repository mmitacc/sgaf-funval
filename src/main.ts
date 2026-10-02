import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter.js';
import { SanitizeInterceptor } from './common/interceptors/sanitize.interceptor.js';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Filtros para orm prisma
  app.useGlobalFilters(new PrismaExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configuración para documentaciones con Swagger
  const config = new DocumentBuilder()
    .setTitle('"Sistema de Gestión Académica y Financiera - FUNVAL"')
    .setDescription('API RESTful que permite la gestión para sistemas SGAF. Por Manuel Mitacc (mmitacc) 🇵🇪.')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu JWT token aqui',
        in: 'header',
      },
      'JWT-auth',
    )
    .addSecurityRequirements('JWT-auth') // Para configurar el token globalmente
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  // Interceptor para limpiar campos sensibles en la data
  app.useGlobalInterceptors(new SanitizeInterceptor());

  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow<number>('PORT') ?? 3000);
}
await bootstrap();
