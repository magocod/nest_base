import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqController } from './rabbitmq.controller';
// import { RabbitmqService } from './rabbitmq.service';
import { configBaseModules, rabbitmqConfig } from '../app.module';

describe('RabbitmqController', () => {
  let controller: RabbitmqController;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(rabbitmqConfig)],
      // controllers: [RabbitmqController],
      // providers: [RabbitmqService],
    }).compile();

    controller = module.get<RabbitmqController>(RabbitmqController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
