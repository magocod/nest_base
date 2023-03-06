import { Test, TestingModule } from '@nestjs/testing';
import { RabbitmqService } from './rabbitmq.service';
import { configBaseModules, rabbitmqConfig } from '../app.module';

describe('RabbitmqService', () => {
  let service: RabbitmqService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...configBaseModules(rabbitmqConfig)],
      // providers: [RabbitmqService],
    }).compile();

    service = module.get<RabbitmqService>(RabbitmqService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
