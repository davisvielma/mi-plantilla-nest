import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT || 3000;
  const globalPrefix = process.env.API_PREFIX || 'api';

  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('API Plantilla NestJS')
    .setDescription('API con arquitectura hexagonal')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('users', 'Gestión de usuarios')
    .addTag('auth', 'Autenticación y autorización')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  await app.listen(port);
  logger.log(
    `🚀 La aplicación se está ejecutando en: http://localhost:${port}/${globalPrefix}`,
  );
  logger.log(
    `📚 La documentación de Swagger está disponible en: http://localhost:${port}/${globalPrefix}/docs`,
  );
}
void bootstrap();
