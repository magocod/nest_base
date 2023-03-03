import { Injectable } from '@nestjs/common';

import * as amqplib from 'amqplib';
import { Options, Connection, Channel } from 'amqplib';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from './config/env.config';
// import { ConsumeMessage } from 'amqplib/properties';

export const taskQueue = 'tasks';

// export type RabbitConnectExtend = Options.Connect & { authMechanism: string[] };

// const rabbitMqOptions: RabbitConnectExtend = {
//   protocol: 'amqp',
//   hostname: process.env.RABBITMQ_HOST,
//   port: process.env.RABBITMQ_PORT as unknown as number,
//   username: process.env.RABBITMQ_USERNAME,
//   password: process.env.RABBITMQ_PASSWORD,
//   vhost: process.env.RABBITMQ_VHOST,
//   authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL'],
// };

// export type ListenerFn = (msg: ConsumeMessage | null) => void;

/**
 * @deprecated
 * only for practice - use nestjs module instead
 */
@Injectable()
export class RabbitService {
  constructor(private configService: ConfigService<EnvConfig>) {}

  private conn: Connection;
  private sender: Channel;
  private listener: Channel;

  async boot(): Promise<{ conn: Connection; sender: Channel }> {
    const rabbitMqOptions: Options.Connect = {
      protocol: 'amqp',
      hostname: this.configService.get('RABBITMQ_HOST'),
      port: this.configService.get('RABBITMQ_PORT'),
      username: this.configService.get('RABBITMQ_USERNAME'),
      password: this.configService.get('RABBITMQ_PASSWORD'),
      vhost: this.configService.get('RABBITMQ_VHOST'),
      // authMechanism: ['PLAIN', 'AMQPLAIN', 'EXTERNAL'],
    };
    // console.log(rabbitMqOptions);
    const conn = await amqplib.connect(rabbitMqOptions);
    this.conn = conn;

    // const ch1 = await conn.createChannel();
    // await ch1.assertQueue(taskQueue, {
    //   durable: true, // can withstand a RabbitMQ restart
    // });

    // Listener
    // await ch1.consume(taskQueue, (msg) => {
    //   if (msg !== null) {
    //     console.log('Received:', msg.content.toString());
    //     ch1.ack(msg);
    //   } else {
    //     console.log('Consumer cancelled by server');
    //   }
    // });

    // Sender
    const ch2 = await conn.createChannel();
    this.sender = ch2;

    return {
      conn,
      sender: ch2,
    };
  }

  getConnection(): Connection {
    return this.conn;
  }

  getSender(): Channel {
    return this.sender;
  }

  getListener(): Channel {
    return this.listener;
  }

  async setListener(): Promise<Channel> {
    const ch1 = await this.conn.createChannel();
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

    this.listener = ch1;

    return ch1;
  }

  /**
   * close all connections, channels
   */
  async close(): Promise<void> {
    await this.conn.close();
  }
}
