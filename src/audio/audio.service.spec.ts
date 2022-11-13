import { Test, TestingModule } from '@nestjs/testing';
import { AudioService } from './audio.service';

describe('AudioService', () => {
  let service: AudioService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [AudioService],
    }).compile();

    service = module.get<AudioService>(AudioService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
