import { Channel, ConsumeMessage } from 'amqplib';
import { ChannelConsumer } from './interfaces';
import { Logger } from '@nestjs/common';

export abstract class RabbitmqChannel<T = unknown>
  implements ChannelConsumer<T, ConsumeMessage>
{
  public logger = new Logger('RabbitmqChannel');

  protected constructor(private readonly queueName: string) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async process(payload: ConsumeMessage): Promise<T> {
    throw new Error(`${this.queueName} process not implemented`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onSuccess(result: T) {
    // pass
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async onError(error: Error) {
    this.logger.error(error);
  }

  async boot(ch: Channel): Promise<void> {
    await ch.assertQueue(this.queueName, {
      durable: true, // can withstand a RabbitMQ restart
    });
    await ch.consume(this.queueName, (msg) => {
      if (msg !== null) {
        // console.log(`${this.queueName} Received: ${msg.content.toString()}`);
        this.process(msg)
          .then((result) => {
            // console.log(`${this.queueName} success: ${result}`);
            this.onSuccess(result).catch((e) => {
              this.logger.error(
                `${this.queueName} onSuccess threw exception ${e}`,
              );
            });
            ch.ack(msg);
          })

          .catch((e) => {
            this.onError(e).catch((e) => {
              this.logger.error(
                `${this.queueName} onError threw exception ${e}`,
              );
            });
            // console.log(`${this.queueName} error: ${e}`);
          });
      } else {
        // console.log(`${this.queueName} Consumer cancelled by server`);
        this.logger.error(`${this.queueName} Consumer cancelled by server`);
      }
    });
  }
}
