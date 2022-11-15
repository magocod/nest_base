import helmet from 'helmet';

import { NestFactory } from '@nestjs/core';
import {Logger, VersioningType} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule, configApp } from './app.module';
import { loggerMiddleware } from './common/middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  configApp(app);

  const config = new DocumentBuilder()
    .setTitle('nest_base API')
    .setDescription('nest_base endpoints')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use(helmet());

  // console.log(
  //   'LOG_HTTP_REQUEST',
  //   process.env.LOG_HTTP_REQUEST,
  //   typeof process.env.LOG_HTTP_REQUEST,
  // );
  if (JSON.parse(process.env.LOG_HTTP_REQUEST)) {
    const reqLogger = new Logger('HTTP');
    app.use(loggerMiddleware(reqLogger));
  }

  await app.listen(process.env.PORT);
  logger.log(`App running on ${process.env.HOST_API}`);
}

void bootstrap();
