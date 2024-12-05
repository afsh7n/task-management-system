import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CoreModule } from "./core/core.module";
import {INestApplication, ValidationPipe} from "@nestjs/common";
import {I18nMiddleware} from "nestjs-i18n";

async function bootstrap() {
  const app : INestApplication = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  app.use(I18nMiddleware);
  app.setGlobalPrefix(process.env.PREFIX_API)
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  CoreModule.configureSwagger(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
