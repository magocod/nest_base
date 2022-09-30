import { Module, ValidationPipe, INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { User, Role, Permission } from './auth/entities';

import { EnvConfiguration } from './config/env.config';

export const globalPrefix = 'api';

export function configBaseModules() {
  return [
    ConfigModule.forRoot({
      load: [EnvConfiguration],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      // autoLoadEntities: true,
      synchronize: true,
      entities: [User, Role, Permission],
    }),
  ];
}

export function configApp(app: INestApplication) {
  app.setGlobalPrefix(globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
}

@Module({
  imports: [...configBaseModules(), AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
