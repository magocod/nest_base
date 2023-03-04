import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Category } from './views/entities';
import { Channel } from 'amqplib';
import { v4 as uuid } from 'uuid';
import { RabbitConsumer } from './rabbit.service';

export const exampleTasks = 'example_tasks';

@Injectable()
export class RabbitChannel implements RabbitConsumer<Category> {
  constructor(private readonly dataSource: DataSource) {}

  process() {
    const rep = this.dataSource.getRepository(Category);
    return rep.save(rep.create({ name: uuid() }));
  }

  async boot(ch: Channel): Promise<void> {
    await ch.assertQueue(exampleTasks, {
      durable: true, // can withstand a RabbitMQ restart
    });
    await ch.consume(exampleTasks, (msg) => {
      if (msg !== null) {
        console.log(
          'RabbitChannel exampleTasks Received:',
          msg.content.toString(),
        );
        this.process()
          .then((cat) => {
            console.log('exampleTasks success', cat);
            ch.ack(msg);
          })
          .catch((e) => {
            console.log('exampleTasks error', e);
          });
      } else {
        console.log('RabbitChannel exampleTasks Consumer cancelled by server');
      }
    });
  }
}
