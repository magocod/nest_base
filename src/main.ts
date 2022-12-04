import helmet from 'helmet';

import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule, configApp } from './app.module';
import { loggerMiddleware } from './common/middleware';
import { WS_SERVER } from './ws/ws.contants';
import { WebSocketServerWrapper } from './ws/ws-server.provider';
// import { createServer } from 'http';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const module: any;

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
  logger.log(`App running on http://localhost:${process.env.PORT}/api`);

  // websocket
  const wss = await app.get<WebSocketServerWrapper, WebSocketServerWrapper>(
    WS_SERVER,
  );

  // option 1
  wss.boot({ server: app.getHttpServer() });
  logger.log(`App running on ws://localhost:${process.env.PORT}`);

  // option 2
  // const server = createServer();
  // wss.boot({ server });
  // server.listen(process.env.WS_PORT);

  // option 3
  // wss.boot({ port: +process.env.WS_PORT });
  // logger.log(`App running on ws://localhost:${process.env.WS_PORT}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

void bootstrap();
