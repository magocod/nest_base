import { OnQueueCompleted, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { EmailJob, EmailJobResult, emailQueueName } from './mail.constants';

@Processor(emailQueueName)
export class MailConsumer {
  private readonly logger = new Logger(MailConsumer.name);

  @OnQueueCompleted()
  handleTranscode(job: EmailJob, result: EmailJobResult) {
    if (job.data.log) {
      this.logger.debug('email OnQueueCompleted');
      // console.log(job);
      // console.log(result);
      this.logger.debug(job.name);
      this.logger.debug(job.data);
      this.logger.debug(result);
      this.logger.debug('email OnQueueCompleted');
    }
  }
}
