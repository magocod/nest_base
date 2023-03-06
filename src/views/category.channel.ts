import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entities';
import { Channel } from 'amqplib';
import { v4 as uuid } from 'uuid';
import { ChannelConsumer } from '../rabbitmq/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { categoryTasks } from './views.contants';

// TODO optimize Channel
@Injectable()
export class CategoryChannel implements ChannelConsumer<Category, string> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  process(payload: string) {
    return this.categoryRepository.save(
      this.categoryRepository.create({ name: `${payload}_${uuid()}` }),
    );
  }

  async boot(ch: Channel): Promise<void> {
    await ch.assertQueue(categoryTasks, {
      durable: true, // can withstand a RabbitMQ restart
    });
    await ch.consume(categoryTasks, (msg) => {
      if (msg !== null) {
        console.log('categoryTasks Received:', msg.content.toString());
        this.process(msg.content.toString())
          .then((cat) => {
            console.log('categoryTasks success', cat);
            ch.ack(msg);
          })
          .catch((e) => {
            console.log('categoryTasks error', e);
          });
      } else {
        console.log('categoryTasks Consumer cancelled by server');
      }
    });
  }
}
