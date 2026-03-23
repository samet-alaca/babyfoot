import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const validation = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  });

  app.useGlobalPipes(validation);
  
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL') || 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Babyfoot Tournament API')
    .setDescription('API pour gérer les tournois de babyfoot')
    .setVersion('1.0')
    .addTag('tournaments')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('PORT') || 4000);
}
bootstrap();
