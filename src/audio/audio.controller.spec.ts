import { Test, TestingModule } from '@nestjs/testing';
import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';
import { audioQueueConfig } from './audio.module';

describe('AudioController', () => {
  let controller: AudioController;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [...audioQueueConfig],
      controllers: [AudioController],
      providers: [AudioService],
    }).compile();

    controller = module.get<AudioController>(AudioController);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
