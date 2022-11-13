import { Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('basic')
  example() {
    return this.mailService.example('example@yopmail.com');
  }

  @Post('template')
  exampleTemplate() {
    return this.mailService.exampleTemplate('example_template@yopmail.com');
  }

  @Post('queue')
  exampleQueue() {
    const url = `http://example.com/auth/confirm?token=abc`;
    return this.mailService.sendEmailQueue({
      log: true,
      options: {
        to: ['example_queue@yopmail.com'],
        subject: 'Queue',
        html: `<b>Queue</b> <br> <b>url: ${url}</b>`,
      },
    });
  }
}
