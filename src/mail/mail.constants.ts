import { Job, Queue } from 'bull';
import { ISendMailOptions } from '@nestjs-modules/mailer';
// import { SentMessageInfo } from 'nodemailer';
import { MessageInfo } from './interfaces';

// urls
export const baseUrl = 'mail';
export const basicUrl = 'basic';
export const templateUrl = 'template';
export const queueUrl = 'queue';

// queue

export const emailQueueName = 'email';

export enum EmailJobNames {
  basic = 'basic',
}

export interface EmailJobData {
  options: ISendMailOptions;
  log: boolean;
}

export type EmailJobResult = MessageInfo;

export type EmailJob = Job<EmailJobData>;

export type EmailQueue = Queue<EmailJobData>;
