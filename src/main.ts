import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter.js';
import { SanitizeInterceptor } from './common/interceptors/sanitize.interceptor.js';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor.js';
import { ConfigService } from '@nestjs/config';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Filtros para orm prisma
  app.useGlobalFilters(new PrismaExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Configuración para documentaciones con Swagger
  const config = new DocumentBuilder()
    .setTitle('"Sistema de Gestión Académica y Financiera - FUNVAL"')
    .setDescription(
      'API RESTful que permite la gestión para sistemas SGAF. Por Manuel Mitacc (mmitacc) 🇵🇪.',
    )
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

  // Interceptor para mostra los log y error con nuestra api
  app.useGlobalInterceptors(new LoggingInterceptor());

  const configService = app.get(ConfigService);

  // Configuración de CORS
  app.enableCors({
    origin: [configService.get<string>('FRONTEND_URL')], // URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Requerido si envías cookies o headers de sesión (ej. HttpOnly cookies)
    allowedHeaders: 'Content-Type, Authorization', // Asegura que estos headers estén permitidos
  });

  await app.listen(configService.getOrThrow<number>('PORT') ?? 3000);
}
await bootstrap();
