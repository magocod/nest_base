export function getQueueToken(name: string): string {
  return `Rabbitmq_${name}`;
}
