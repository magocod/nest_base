import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedRunner } from './seed.command';
import { ExampleRunner } from './example.command';

import { configBaseModules } from '../app.module';
import { AuthModule } from '../auth/auth.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [...configBaseModules(), AuthModule, NotificationsModule],
  providers: [SeedService, SeedRunner, ExampleRunner],
})
export class SeedModule {}
