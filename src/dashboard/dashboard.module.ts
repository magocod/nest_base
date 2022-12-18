import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardResolver } from './dashboard.resolver';

@Module({
  providers: [DashboardResolver, DashboardService],
})
export class DashboardModule {}
