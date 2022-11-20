import { OnQueueCompleted, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { AudioJob, AudioJobResult, audioQueueName } from './audio.constants';

@Processor(audioQueueName)
export class AudioConsumer {
  private readonly logger = new Logger(AudioConsumer.name);

  @OnQueueCompleted()
  handleTranscode(job: AudioJob, result: AudioJobResult) {
    if (job.data.log) {
      this.logger.debug('audio OnQueueCompleted');
      // console.log(job);
      // console.log(result);
      this.logger.debug(job.name);
      this.logger.debug(job.data);
      this.logger.debug('result: ' + result);
      this.logger.debug('audio OnQueueCompleted');
    }
  }
}
