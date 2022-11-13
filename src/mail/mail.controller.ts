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
}
