import {
  Module,
  ValidationPipe,
  INestApplication,
  VersioningType,
  // OnModuleDestroy,
  // OnModuleInit,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
// import { User, Role, Permission } from './auth/entities';

import { EnvConfiguration } from './config/env.config';

// import { UserCreate1664658587799 } from './migration/1664658587799-UserCreate';
import { CatsModule } from './cats/cats.module';
import { MailModule } from './mail/mail.module';
import { AudioModule } from './audio/audio.module';

export const globalPrefix = 'api';

// import './data-source';
import { BullModule } from '@nestjs/bull';
import { JoiValidationSchema } from './config/joi.validation';
import { MessagesModule } from './messages/messages.module';
import { NotificationsModule } from './notifications/notifications.module';
// import { Notification } from './notifications/entities';
import { WsModule } from './ws/ws.module';
// import { WsModule } from './ws/ws.module';
// import { DashboardModule } from './dashboard/dashboard.module';
// import { GraphQLModule } from '@nestjs/graphql';
// import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
// import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
// import { AppResolver } from './app.resolver';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostsModule } from './posts/posts.module';
import { ViewsModule } from './views/views.module';
import { RabbitmqModule } from './rabbitmq/rabbitmq.module';
import { asyncTaskQueue, syncTaskQueue } from './rabbitmq/rabbitmq.constants';
import { CategoryChannel } from './views/category.channel';
import { RabbitmqExplorer } from './rabbitmq/rabbitmq.explorer';
// import { ModuleRef } from '@nestjs/core';
// import { RabbitService } from './rabbit.service';
// import { RabbitChannel } from './rabbit.channel';

// export function configBaseModules() {
//   return [
//     ConfigModule.forRoot({
//       load: [EnvConfiguration],
//     }),
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: process.env.DB_HOST,
//       port: +process.env.DB_PORT,
//       database: process.env.DB_NAME,
//       username: process.env.DB_USERNAME,
//       password: process.env.DB_PASSWORD,
//       // autoLoadEntities: true,
//       // logging: false,
//       synchronize: false, // only for quick tests
//       entities: [User, Role, Permission],
//       // example generate -> typeorm migration:create ./src/migration/UserCreate
//       // migrations: ['dist/migration/**/*.js'],
//       // migrations: [UserCreate1664658587799],
//     }),
//   ];
// }

// default config
export const commonConfig = {
  postgres: true,
  mongodb: true,
  websocket: true,
  mysql: true,
  rabbitmq: true,
};

// without db
export const withoutDbConfig = {
  ...commonConfig,
  mongodb: false,
  postgres: false,
  mysql: false,
  rabbitmq: false,
};

// only postgresql
export const postgresConfig = {
  ...commonConfig,
  mongodb: false,
  websocket: false,
  mysql: false,
  rabbitmq: false,
};

// only mongodb
export const mongoConfig = {
  ...commonConfig,
  postgres: false,
  websocket: false,
  mysql: false,
  rabbitmq: false,
};

// only mysql
export const mysqlConfig = {
  ...commonConfig,
  postgres: false,
  websocket: false,
  mongodb: false,
  rabbitmq: false,
};

export const rabbitmqConfig = {
  ...commonConfig,
  postgres: false,
  websocket: false,
  mongodb: false,
  mysql: false,
};

export function configBaseModules(config = commonConfig) {
  const modules = [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: +process.env.REDIS_PORT,
        maxRetriesPerRequest: 2,
        // password: process.env.REDIS_PASSWORD
      },
      // limiter: {
      //   max: 1,
      //   duration: 8000,
      // },
    }),
    // GraphQLModule.forRoot<ApolloDriverConfig>({
    //   driver: ApolloDriver,
    //   autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    //   playground: false,
    //   plugins: [ApolloServerPluginLandingPageLocalDefault],
    // }),
  ];

  if (config.postgres) {
    modules.push(
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        database: process.env.DB_NAME,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        // logging: false,
        // synchronize: false, // only for quick tests
        // entities: [User, Role, Permission, Notification],
        autoLoadEntities: true,
        // example generate -> typeorm migration:create ./src/migration/UserCreate
        // migrations: ['dist/migration/**/*.js'],
        // migrations: [UserCreate1664658587799],
      }),
    );
  }

  if (config.mongodb) {
    modules.push(MongooseModule.forRoot(process.env.MONGO_URL));
  }

  if (config.websocket) {
    modules.push(
      WsModule.forRoot({
        port: +process.env.WS_PORT,
      }),
    );
  }

  if (config.mysql) {
    modules.push(
      SequelizeModule.forRoot({
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: process.env.MYSQL_DB_PASSWORD,
        database: process.env.MYSQL_DB_NAME,
        autoLoadModels: true,
        synchronize: false,
        logging: false,
      }),
    );
  }

  if (config.rabbitmq) {
    modules.push(
      RabbitmqModule.forRoot({
        RABBITMQ_HOST: process.env.RABBITMQ_HOST,
        RABBITMQ_PORT: +process.env.RABBITMQ_PORT,
        RABBITMQ_USERNAME: process.env.RABBITMQ_USERNAME,
        RABBITMQ_PASSWORD: process.env.RABBITMQ_PASSWORD,
        RABBITMQ_VHOST: process.env.RABBITMQ_VHOST,
        queues: [
          {
            queue: asyncTaskQueue,
            onMessage: (channel, logger) => {
              return async function (msg) {
                // crash server
                // throw new Error('example error');
                if (msg !== null) {
                  // console.log('asyncTaskQueue Received:', msg.content.toString());
                  logger?.debug(
                    'asyncTaskQueue Received:' + msg.content.toString(),
                  );
                  channel.ack(msg);
                } else {
                  // console.log('asyncTaskQueue Consumer cancelled by server');
                  logger?.debug('asyncTaskQueue Consumer cancelled by server');
                }
              };
            },
          },
          {
            queue: syncTaskQueue,
            onMessage: (channel, logger) => {
              return function (msg) {
                if (msg === null) {
                  // console.log('syncTaskQueue Consumer cancelled by server');
                  logger?.warn('syncTaskQueue Consumer cancelled by server');
                  return;
                }

                try {
                  const content = msg.content.toString();

                  if (content === 'error') {
                    throw new Error('example error');
                  }

                  // console.log('syncTaskQueue Received:', content);
                  logger?.debug('syncTaskQueue Received:' + content);
                  channel.ack(msg);
                } catch (e) {
                  if (msg?.fields?.redelivered) {
                    // console.log('syncTaskQueue redelivered');
                    logger?.warn(
                      'syncTaskQueue redelivered - ' + msg?.fields?.redelivered,
                    );
                    channel.ack(msg);
                    return;
                  }

                  if (e instanceof Error) {
                    // console.log('syncTaskQueue throw error ' + e.message);
                    logger?.error('syncTaskQueue throw error ' + e.message);
                    // logger?.warn('syncTaskQueue throw error ' + e.stack);
                  } else {
                    // console.log('syncTaskQueue throw exception ' + e);
                    logger?.error('syncTaskQueue throw exception ' + e);
                  }
                }
              };
            },
          },
        ],
        consumers: [CategoryChannel],
      }),
    );
  }

  return modules;
}

export function configApp(app: INestApplication) {
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });
}

@Module({
  imports: [
    ...configBaseModules(),
    AuthModule,
    CatsModule,
    MailModule,
    AudioModule,
    MessagesModule,
    NotificationsModule,
    // DashboardModule,
    PostsModule,
    ViewsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // AppResolver,
    // RabbitService,
    RabbitmqExplorer,
  ],
})
export class AppModule {}
// export class AppModule implements OnModuleInit, OnModuleDestroy {
//   constructor(private moduleRef: ModuleRef) {}
//
//   async onModuleInit() {
//     // console.log('AppModule.OnModuleInit');
//     const rabbitService = await this.moduleRef.get<RabbitService>(
//       RabbitService,
//     );
//     await rabbitService.boot();
//     await rabbitService.setListener();
//     await rabbitService.registerListener(RabbitChannel);
//   }
//
//   async onModuleDestroy() {
//     // console.log('AppModule.onModuleDestroy');
//     const rabbitService = await this.moduleRef.get<RabbitService>(
//       RabbitService,
//     );
//     await rabbitService.close();
//   }
// }
