import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import {
  EmailJob,
  EmailJobNames,
  EmailJobResult,
  emailQueueName,
} from './mail.constants';
import { MailerService } from '@nestjs-modules/mailer';

@Processor(emailQueueName)
export class MailProcessor {
  private readonly logger = new Logger(MailProcessor.name);

  constructor(private mailerService: MailerService) {}

  @Process(EmailJobNames.basic)
  handleSendEmailBasic(job: EmailJob): Promise<EmailJobResult> {
    if (job.data.log) {
      this.logger.debug('start send email...');
    }

    return this.mailerService.sendMail({
      ...job.data.options,
    });
  }
}
