import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category, Post } from './entities';
import { Channel } from 'amqplib';
import { v4 as uuid } from 'uuid';
import { ChannelConsumer } from '../rabbitmq/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { postTasks } from './views.contants';

// TODO optimize Channel
@Injectable()
export class PostChannel implements ChannelConsumer<Post, string> {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async process(payload: string) {
    const category = await this.categoryRepository.findOneOrFail({ where: {} });
    console.log(category);
    return this.postRepository.save(
      this.postRepository.create({ name: `${payload}_${uuid()}`, category }),
    );
  }

  async boot(ch: Channel): Promise<void> {
    await ch.assertQueue(postTasks, {
      durable: true, // can withstand a RabbitMQ restart
    });
    await ch.consume(postTasks, (msg) => {
      if (msg !== null) {
        console.log('postTasks Received:', msg.content.toString());
        this.process(msg.content.toString())
          .then((cat) => {
            console.log('postTasks success', cat);
            ch.ack(msg);
          })
          .catch((e) => {
            console.log('postTasks error', e);
          });
      } else {
        console.log('postTasks Consumer cancelled by server');
      }
    });
  }
}
