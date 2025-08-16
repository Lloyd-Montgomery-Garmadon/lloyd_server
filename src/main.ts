import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true, // 或者直接写 '*'
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // 如果需要带cookie
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 关键
      transformOptions: {
        enableImplicitConversion: true, // 可以省略 @Type
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
