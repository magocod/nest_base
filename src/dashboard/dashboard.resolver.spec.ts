import { Test, TestingModule } from '@nestjs/testing';
import { DashboardResolver } from './dashboard.resolver';
import { DashboardService } from './dashboard.service';

describe('DashboardResolver', () => {
  let resolver: DashboardResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DashboardResolver, DashboardService],
    }).compile();

    resolver = module.get<DashboardResolver>(DashboardResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
