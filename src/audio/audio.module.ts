import { Module } from '@nestjs/common';
import { AudioService } from './audio.service';
import { AudioController } from './audio.controller';
import { BullModule } from '@nestjs/bull';
import { AudioProcessor } from './audio.processor';
import { AudioConsumer } from './audio.consumer';
import { audioQueueName } from './audio.constants';

export const audioQueueConfig = [
  BullModule.registerQueue({
    name: audioQueueName,
  }),
];

@Module({
  imports: [...audioQueueConfig],
  controllers: [AudioController],
  providers: [AudioService, AudioProcessor, AudioConsumer],
  exports: [BullModule, AudioService],
})
export class AudioModule {}
