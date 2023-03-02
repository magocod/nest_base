import { RABBITMQ_CONNECTION, RABBITMQ_SENDER } from './rabbitmq.constants';
import { Provider } from '@nestjs/common';
import { RabbitmqModuleOptions } from './interfaces';
import * as amqplib from 'amqplib';
import { Options, Connection } from 'amqplib';
import { taskQueue } from '../rabbit.service';

export function createRabbitmqConnectionProvider(
  options: RabbitmqModuleOptions,
): Provider {
  return {
    provide: RABBITMQ_CONNECTION,
    useFactory: () => {
      const rabbitMqOptions: Options.Connect = {
        protocol: 'amqp',
        hostname: options.RABBITMQ_HOST,
        port: options.RABBITMQ_PORT,
        username: options.RABBITMQ_USERNAME,
        password: options.RABBITMQ_PASSWORD,
        vhost: options.RABBITMQ_VHOST,
      };
      return amqplib.connect(rabbitMqOptions);
    },
  };
}

export function createRabbitmqSenderProvider(): Provider {
  return {
    provide: RABBITMQ_SENDER,
    useFactory: async (conn: Connection) => {
      const ch1 = await conn.createChannel();
      await ch1.assertQueue(taskQueue, {
        durable: true, // can withstand a RabbitMQ restart
      });
      await ch1.consume(taskQueue, (msg) => {
        if (msg !== null) {
          console.log('Received:', msg.content.toString());
          ch1.ack(msg);
        } else {
          console.log('Consumer cancelled by server');
        }
      });
      return conn.createChannel();
    },
    inject: [RABBITMQ_CONNECTION],
  };
}
