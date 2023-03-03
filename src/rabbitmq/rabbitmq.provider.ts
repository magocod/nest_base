import { RABBITMQ_CONNECTION, RABBITMQ_SENDER } from './rabbitmq.constants';
import { Logger, Provider } from '@nestjs/common';
import { RabbitmqModuleOptions } from './interfaces';
import * as amqplib from 'amqplib';
import { Options, Connection } from 'amqplib';
import { taskQueue } from './rabbitmq.constants';

export function createRabbitmqConnectionProvider(
  options: RabbitmqModuleOptions,
): Provider {
  return {
    provide: RABBITMQ_CONNECTION,
    useFactory: async () => {
      const rabbitMqOptions: Options.Connect = {
        protocol: 'amqp',
        hostname: options.RABBITMQ_HOST,
        port: options.RABBITMQ_PORT,
        username: options.RABBITMQ_USERNAME,
        password: options.RABBITMQ_PASSWORD,
        vhost: options.RABBITMQ_VHOST,
      };
      const conn = await amqplib.connect(rabbitMqOptions);

      const logger = new Logger('RabbitMq');

      // create queue directly
      const ch1 = await conn.createChannel();
      await ch1.assertQueue(taskQueue, {
        durable: true, // can withstand a RabbitMQ restart
      });
      await ch1.consume(taskQueue, (msg) => {
        if (msg !== null) {
          // console.log('taskQueue Received:', msg.content.toString());
          logger.debug('taskQueue Received:' + msg.content.toString());
          ch1.ack(msg);
        } else {
          // console.log('taskQueue Consumer cancelled by server');
          logger.debug('taskQueue Consumer cancelled by server');
        }
      });

      // create queue from config
      for (const queueConfig of options.queues) {
        const ch = await conn.createChannel();
        await ch.assertQueue(queueConfig.queue, {
          durable: true, // can withstand a RabbitMQ restart
        });

        // Get a message from the queue that is ready for processing
        // await ch.prefetch(1);

        await ch.consume(
          queueConfig.queue,
          queueConfig.onMessage(ch, logger),
          queueConfig.options,
        );
      }

      return conn;
    },
  };
}

export function createRabbitmqSenderProvider(): Provider {
  return {
    provide: RABBITMQ_SENDER,
    useFactory: (conn: Connection) => {
      return conn.createChannel();
    },
    inject: [RABBITMQ_CONNECTION],
  };
}

// TODO create listener providers
