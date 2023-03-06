import { Test, TestingModule } from '@nestjs/testing';
import { RabbitService } from './rabbit.service';
import { ConfigModule } from '@nestjs/config';
import { EnvConfiguration } from './config/env.config';
import { JoiValidationSchema } from './config/joi.validation';

describe('WsService', () => {
  let service: RabbitService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [EnvConfiguration],
          validationSchema: JoiValidationSchema,
        }),
      ],
      providers: [RabbitService],
    }).compile();

    service = module.get<RabbitService>(RabbitService);
    await service.boot();
    await service.setListener();
  });

  afterAll(async () => {
    // await module.close();
    await service.close();
  });

  it('must have a connection instance', async () => {
    expect(service.getConnection()).toBeDefined();
  });

  // it('successfully submit task in queue', async () => {
  //   const sender = service.getSender();
  //   const rs = sender.sendToQueue(taskQueue, Buffer.from('something to do'));
  //
  //   expect(rs).toEqual(true);
  // });
});
