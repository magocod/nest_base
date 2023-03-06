import { Channel, ConsumeMessage, Options } from 'amqplib';
import { Logger, Type } from '@nestjs/common';

export interface RabbitmqModuleOptions {
  RABBITMQ_HOST: string;
  RABBITMQ_PORT: number;
  RABBITMQ_USERNAME: string;
  RABBITMQ_PASSWORD: string;
  RABBITMQ_VHOST: string;
  queues: RabbitmqQueue[];
  consumers: ChannelConsumerType[];
}

export type RabbitmqListenerFn = (msg: ConsumeMessage | null) => void;

/**
 * @deprecated
 */
export interface RabbitmqQueue {
  queue: string;
  onMessage: (channel: Channel, logger?: Logger) => RabbitmqListenerFn;
  options?: Options.Consume;
}

/**
 * T = ResultQueue ...
 *
 * P = PayloadQueue ...
 */
export interface ChannelConsumer<T = unknown, P = unknown> {
  process(payload: P): Promise<T>;
  boot(ch: Channel): Promise<void>;
}

export type ChannelConsumerType = Type<ChannelConsumer>;

export interface ChannelConsumerProvider {
  name: string;
  class: ChannelConsumerType;
  instance?: Channel;
}
