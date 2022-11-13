import { Controller, Post } from '@nestjs/common';
import { AudioService } from './audio.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Audio')
@Controller('audio')
export class AudioController {
  constructor(
    private readonly audioService: AudioService,
    @InjectQueue('audio') private readonly audioQueue: Queue,
  ) {}

  @Post('transcode')
  async transcode() {
    await this.audioQueue.add('transcode', {
      file: 'audio.mp3',
    });
  }
}
