import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:5173'], // 允许的前端地址，可以改成你实际地址或 '*'
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
