import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Global Middleware
  app.useGlobalPipes(new ValidationPipe());
  app.useLogger(app.get(Logger));
  app.setGlobalPrefix('api');

  const configService = app.get(ConfigService);
  const port: number = configService.getOrThrow<number>('PORT');
  await app.listen(port);

  // Log server info
  console.log(`Application is running on: ${await app.getUrl()}`);
}

// Catch uncaught errors
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

bootstrap().catch((err) => {
  console.error('Failed to bootstrap the application', err);
});
