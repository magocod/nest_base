import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedRunner } from './seed.command';
import { ExampleRunner } from './example.command';

import { configBaseModules } from '../app.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [...configBaseModules(), AuthModule],
  providers: [SeedService, SeedRunner, ExampleRunner],
})
export class SeedModule {}
