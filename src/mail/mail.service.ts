import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  example(email: string): Promise<SentMessageInfo> {
    const url = `example.com/auth/confirm?token=abc`;

    return this.mailerService.sendMail({
      to: email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Example',
      html: `<b>Example</b> <br> <b>url: ${url}</b>`,
    });
  }

  exampleTemplate(email: string): Promise<SentMessageInfo> {
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

  // TODO queue email example
  // ...
}
