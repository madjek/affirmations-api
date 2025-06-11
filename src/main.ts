import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { RefreshTokenInterceptor } from './auth/interceptors/refresh-token.interceptor';

const port = Number(process.env.PORT) || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Global refresh token interceptor
  app.useGlobalInterceptors(app.get(RefreshTokenInterceptor));

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Affirmations API')
    .setDescription('API documentation for Affirmations App')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  // Swagger Documentation
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation available at: ${await app.getUrl()}/api`);
}

void bootstrap();
