import { Resolver } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';

@Resolver()
export class DashboardResolver {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(private readonly dashboardService: DashboardService) {}

  // ...
}
