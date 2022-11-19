import { Test, TestingModule } from '@nestjs/testing';
// import { CatsService } from './cats.service';
import { configBaseModules, mongoConfig } from '../app.module';
import { CatsModule } from './cats.module';
import { OwnerController } from './owner.controller';

describe('OwnerController', () => {
  let controller: OwnerController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(mongoConfig), CatsModule],
      // controllers: [CatsController],
      // providers: [CatsService],
    }).compile();

    controller = module.get<OwnerController>(OwnerController);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });
});
