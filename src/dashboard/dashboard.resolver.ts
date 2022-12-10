import { Query, Resolver } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { Dashboard } from './types';

@Resolver()
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Query(() => Dashboard, { name: 'sampleDashboard' })
  sampleDashboard(): Dashboard {
    return this.dashboardService.sample();
  }
}
