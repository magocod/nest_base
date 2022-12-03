import {
  Module,
  ValidationPipe,
  INestApplication,
  VersioningType,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { User, Role, Permission } from './auth/entities';

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
import { Notification } from './notifications/entities';
import { WsModule } from './ws/ws.module';

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
export const commonConfig = { postgres: true, mongodb: true };

// without db
export const withoutDbConfig = {
  ...commonConfig,
  mongodb: false,
  postgres: false,
};

// only postgresql
export const postgresConfig = { ...commonConfig, mongodb: false };

// only mongodb
export const mongoConfig = { ...commonConfig, postgres: false };

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
        // autoLoadEntities: true,
        // logging: false,
        synchronize: false, // only for quick tests
        entities: [User, Role, Permission, Notification],
        // example generate -> typeorm migration:create ./src/migration/UserCreate
        // migrations: ['dist/migration/**/*.js'],
        // migrations: [UserCreate1664658587799],
      }),
    );
  }

  if (config.mongodb) {
    modules.push(MongooseModule.forRoot(process.env.MONGO_URL));
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
    // WsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
