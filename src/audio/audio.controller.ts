import { Body, Controller, Post } from '@nestjs/common';
import { AudioService } from './audio.service';
import { InjectQueue } from '@nestjs/bull';

import { ApiTags } from '@nestjs/swagger';
import { AudioQueue, audioQueueName, AudioJobNames } from './audio.constants';
import { AudioTranscodeDto } from './dto';

@ApiTags('Audio')
@Controller('audio')
export class AudioController {
  constructor(
    private readonly audioService: AudioService,
    @InjectQueue(audioQueueName) private readonly audioQueue: AudioQueue,
  ) {}

  @Post('transcode')
  async transcode(@Body() audioTranscodeDto: AudioTranscodeDto) {
    await this.audioQueue.add(AudioJobNames.transcode, {
      file: 'audio.mp3',
      log: true,
      ...audioTranscodeDto,
    });
  }
}
