import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validação global
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }),
  );

  // --- Swagger sempre habilitado no dev ---
  const config = new DocumentBuilder()
    .setTitle('Biblioteca API')
    .setDescription('API REST para gerenciar uma pequena biblioteca digital (Books, Users, Loans).')
    .setVersion('1.0.0')
    .setContact('Igor Mendes', 'https://github.com/igorsamendes', '')
    // .addBearerAuth() // se no futuro usar JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document, {
    // 🔑 Isso garante o JSON em /api-json
    jsonDocumentUrl: 'api-json',
    swaggerOptions: { persistAuthorization: true },
    customSiteTitle: 'Biblioteca API Docs',
  });
  // ---------------------------------------

  await app.listen(3000);
}
bootstrap();
