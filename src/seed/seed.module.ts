import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedRunner } from './seed.command';
import { ExampleRunner } from './example.command';

import { configBaseModules } from '../app.module';

@Module({
  imports: [...configBaseModules()],
  providers: [SeedService, SeedRunner, ExampleRunner],
})
export class SeedModule {}
