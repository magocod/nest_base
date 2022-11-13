import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { BullModule } from '@nestjs/bull';
import { AudioProcessor } from './audio.processor';
import { AudioConsumer } from './audio.consumer';

export const audioQueueConfig = [
  BullModule.registerQueue({
    name: 'audio',
  }),
];

@Module({
  imports: [...audioQueueConfig],
  controllers: [AudioController],
  providers: [AudioService, AudioProcessor, AudioConsumer],
})
export class AudioModule {}
