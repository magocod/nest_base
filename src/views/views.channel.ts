import { Injectable } from '@nestjs/common';
// import { DataSource } from 'typeorm';
import { Channel } from 'amqplib';
import { CanInitializeConsumer } from '../rabbitmq/interfaces';
import { viewTasks } from './views.contants';
// import { PostCategory } from './views.views';
import { ViewsService } from './views.service';

@Injectable()
export class ViewsChannel implements CanInitializeConsumer {
  constructor(
    // private readonly dataSource: DataSource,
    private readonly viewsService: ViewsService,
  ) {}

  async boot(ch: Channel): Promise<void> {
    await ch.assertQueue(viewTasks, {
      durable: true, // can withstand a RabbitMQ restart
    });
    await ch.consume(viewTasks, (msg) => {
      if (msg !== null) {
        console.log('viewTasks Received:', msg.content.toString());
        // this.dataSource.manager
        //   .find(PostCategory, { take: 1 })
        this.viewsService
          .findAll()
          .then((cat) => {
            console.log('viewTasks success', cat);
            ch.ack(msg);
          })
          .catch((e) => {
            console.log('viewTasks error', e);
          });
      } else {
        console.log('viewTasks Consumer cancelled by server');
      }
    });
  }
}
