import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardResolver } from './dashboard.resolver';
import { ExampleResolver } from './example.resolver';

@Module({
  providers: [DashboardResolver, DashboardService, ExampleResolver],
})
export class DashboardModule {}
