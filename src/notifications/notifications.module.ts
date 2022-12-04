import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities';
import { AuthModule } from '../auth/auth.module';
import { WsModule } from '../ws/ws.module';
import {
  ConfigModule,
  // ConfigService
} from '@nestjs/config';
// import { EnvConfig } from '../config/env.config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Notification]),
    AuthModule,
    WsModule.forFeature(),
    // WsModule.register(),
    // WsModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   useFactory: (configService: ConfigService<EnvConfig>) => {
    //     // console.log('configService WS_PORT', configService.get('WS_PORT'));
    //     return {
    //       port: configService.get('WS_PORT'),
    //     };
    //   },
    // }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [TypeOrmModule],
})
export class NotificationsModule {}
