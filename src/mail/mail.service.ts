import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
// import { SentMessageInfo } from 'nodemailer';
import { InjectQueue } from '@nestjs/bull';
import {
  EmailJob,
  EmailJobData,
  EmailJobNames,
  EmailQueue,
  emailQueueName,
} from './mail.constants';
import { MessageInfo } from './interfaces';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    @InjectQueue(emailQueueName) private readonly emailQueue: EmailQueue,
  ) {}

  example(email: string): Promise<MessageInfo> {
    const url = `http://example.com/auth/confirm?token=abc`;

    return this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Example',
      html: `<b>Example</b> <br> <b>url: ${url}</b>`,
    });
  }

  exampleTemplate(email: string): Promise<MessageInfo> {
    const url = `http://example.com/auth/confirm?token=abc`;

    return this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Example',
      template: './confirmation', // `.hbs` extension is appended automatically
      context: {
        // ✏️ filling curly brackets with content
        name: 'example',
        url,
      },
    });
  }

  sendEmailQueue(data: EmailJobData): Promise<EmailJob> {
    // console.log(this.emailQueue)
    return this.emailQueue.add(EmailJobNames.basic, {
      log: true,
      ...data,
    });
  }
}
