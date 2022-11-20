import { Test, TestingModule } from '@nestjs/testing';
import { AudioProcessor } from './audio.processor';
import { Job } from 'bull';

describe('AudioProcessor', () => {
  let processor: AudioProcessor;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [AudioProcessor],
    }).compile();

    processor = module.get<AudioProcessor>(AudioProcessor);
  });

  afterAll(async () => {
    await module.close();
  });

  it('handleTranscode', () => {
    const job = { data: { log: true, file: 'example.mp3' } };
    const result = processor.handleTranscode(job as Job);
    // console.log(result)
    expect(result.includes('transcode')).toEqual(true);
  });
});
