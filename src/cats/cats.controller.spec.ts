import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
// import { CatsService } from './cats.service';
import {configBaseModules, mongoConfig} from '../app.module';
import { CatsModule } from './cats.module';

describe('CatsController', () => {
  let controller: CatsController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        ...configBaseModules(mongoConfig),
        CatsModule,
      ],
      // controllers: [CatsController],
      // providers: [CatsService],
    }).compile();

    controller = module.get<CatsController>(CatsController);
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });
});
