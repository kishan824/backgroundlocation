import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const port = 3000;
  const host = '192.168.12.115';

  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(port, host);

  console.log(`WebSocket running on ws://${host}:${port}`);
  // await open(`http://${host}:${port}`);
}

bootstrap();
