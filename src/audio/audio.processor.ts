import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import {
  AudioJob,
  AudioJobNames,
  AudioJobResult,
  audioQueueName,
} from './audio.constants';

@Processor(audioQueueName)
export class AudioProcessor {
  private readonly logger = new Logger(AudioProcessor.name);

  @Process(AudioJobNames.transcode)
  handleTranscode(job: AudioJob): AudioJobResult {
    // console.log('call AudioProcessor');
    const t = 'transcode:' + job.data.file;
    if (job.data.log) {
      this.logger.debug('Start transcoding...');
      this.logger.debug(job.name);
      this.logger.debug(job.data);
      this.logger.debug('Transcoding completed');
    }
    return t;
  }
}
