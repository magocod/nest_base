import { RABBITMQ_CONSUMER } from './rabbitmq.constants';

export function getQueueToken(name: string): string {
  return `Rabbitmq_${name}`;
}

export function getConsumerChannelToken(name: string): string {
  return `${RABBITMQ_CONSUMER}_${name}`;
}
