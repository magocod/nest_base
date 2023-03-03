import { Channel, ConsumeMessage, Options } from 'amqplib';
import { Logger } from '@nestjs/common';

export interface RabbitmqModuleOptions {
  RABBITMQ_HOST: string;
  RABBITMQ_PORT: number;
  RABBITMQ_USERNAME: string;
  RABBITMQ_PASSWORD: string;
  RABBITMQ_VHOST: string;
  queues: RabbitmqQueue[];
}

export type RabbitmqListenerFn = (msg: ConsumeMessage | null) => void;

export interface RabbitmqQueue {
  queue: string;
  onMessage: (channel: Channel, logger?: Logger) => RabbitmqListenerFn;
  options?: Options.Consume;
}
