import { Channel, ConsumeMessage } from 'amqplib';
import { ChannelConsumer } from './interfaces';

export abstract class RabbitmqChannel<T = unknown>
  implements ChannelConsumer<T, ConsumeMessage>
{
  protected constructor(private readonly queueName: string) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async process(payload: ConsumeMessage): Promise<T> {
    throw new Error(`${this.queueName} process not implemented`);
  }

  async boot(ch: Channel): Promise<void> {
    await ch.assertQueue(this.queueName, {
      durable: true, // can withstand a RabbitMQ restart
    });
    await ch.consume(this.queueName, (msg) => {
      if (msg !== null) {
        console.log(`${this.queueName} Received: ${msg.content.toString()}`);
        this.process(msg)
          .then((result) => {
            console.log(`${this.queueName} success: ${result}`);
            ch.ack(msg);
          })
          .catch((e) => {
            console.log(`${this.queueName} error: ${e}`);
          });
      } else {
        console.log(`${this.queueName} Consumer cancelled by server`);
      }
    });
  }
}
