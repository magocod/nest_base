export function getQueueToken(name: string): string {
  return `Rabbitmq_${name}`;
}

export function getConsumerChannelToken(name: string): string {
  return `Rabbitmq_consumer_${name}`;
}
