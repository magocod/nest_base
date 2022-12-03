import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities';
import { AuthModule } from '../auth/auth.module';
import { WsModule } from '../ws/ws.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvConfig } from '../config/env.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    AuthModule,
    // WsModule,
    // WsModule.register(),
    WsModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvConfig>) => {
        // console.log('configService WS_PORT', configService.get('WS_PORT'));
        return {
          PORT: configService.get('WS_PORT'),
        };
      },
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
  exports: [TypeOrmModule, WsModule],
})
export class NotificationsModule {}
