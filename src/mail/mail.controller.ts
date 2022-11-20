import { Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiVersion } from '../app.constants';
import { baseUrl, basicUrl, templateUrl, queueUrl } from './mail.constants';

@ApiTags('Mail')
@Controller({ path: baseUrl, version: ApiVersion.v1 })
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post(basicUrl)
  example() {
    return this.mailService.example('example@yopmail.com');
  }

  @Post(templateUrl)
  exampleTemplate() {
    return this.mailService.exampleTemplate('example_template@yopmail.com');
  }

  @Post(queueUrl)
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
