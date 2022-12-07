import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { DashboardService } from './dashboard.service';
import { Dashboard } from './entities/dashboard.entity';
import { CreateDashboardInput } from './dto/create-dashboard.input';
import { UpdateDashboardInput } from './dto/update-dashboard.input';

@Resolver(() => Dashboard)
export class DashboardResolver {
  constructor(private readonly dashboardService: DashboardService) {}

  @Mutation(() => Dashboard)
  createDashboard(
    @Args('createDashboardInput') createDashboardInput: CreateDashboardInput,
  ) {
    return this.dashboardService.create(createDashboardInput);
  }

  @Query(() => [Dashboard], { name: 'dashboard' })
  findAll() {
    return this.dashboardService.findAll();
  }

  @Query(() => Dashboard, { name: 'dashboard' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.dashboardService.findOne(id);
  }

  @Mutation(() => Dashboard)
  updateDashboard(
    @Args('updateDashboardInput') updateDashboardInput: UpdateDashboardInput,
  ) {
    return this.dashboardService.update(
      updateDashboardInput.id,
      updateDashboardInput,
    );
  }

  @Mutation(() => Dashboard)
  removeDashboard(@Args('id', { type: () => Int }) id: number) {
    return this.dashboardService.remove(id);
  }
}
