import { Job, Queue } from 'bull';
import { ISendMailOptions } from '@nestjs-modules/mailer';
import { SentMessageInfo } from 'nodemailer';

export const emailQueueName = 'email';

export enum EmailJobNames {
  basic = 'basic',
}

export interface EmailJobData {
  options: ISendMailOptions;
  log: boolean;
}

export type EmailJobResult = SentMessageInfo;

export type EmailJob = Job<EmailJobData>;

export type EmailQueue = Queue<EmailJobData>;
