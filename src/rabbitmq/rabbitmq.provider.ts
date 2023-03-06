import { RABBITMQ_CONNECTION, RABBITMQ_SENDER } from './rabbitmq.constants';
import { Logger, Provider } from '@nestjs/common';
import {
  ChannelConsumerProvider,
  ChannelConsumerType,
  RabbitmqModuleOptions,
} from './interfaces';
import * as amqplib from 'amqplib';
import { Options, Connection } from 'amqplib';
import { taskQueue } from './rabbitmq.constants';
import { getConsumerChannelToken } from './rabbitmq.utils';
// import { ModuleRef } from '@nestjs/core';

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

      // They are only basic configurations of queues and practices,
      // they do not have access to application services (not very useful in real life)

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

      // create (basic) queue from config
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
export function createRabbitmqConsumerProvider(
  moduleName: string,
  consumers: ChannelConsumerType[],
): Provider {
  return {
    provide: getConsumerChannelToken(moduleName),
    useFactory: () => {
      const wrappers: ChannelConsumerProvider[] = consumers.map((c) => {
        return {
          name: c.name,
          class: c,
        };
      });
      return wrappers;
    },
  };
}
