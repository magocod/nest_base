import { Test, TestingModule } from '@nestjs/testing';
import { ViewsController } from './views.controller';
// import { ViewsService } from './views.service';
import { configBaseModules, postgresConfig } from '../app.module';
import { ViewsModule } from './views.module';

describe('ViewsController', () => {
  let controller: ViewsController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules({ ...postgresConfig }), ViewsModule],
      // controllers: [ViewsController],
      // providers: [ViewsService],
    }).compile();

    controller = module.get<ViewsController>(ViewsController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
