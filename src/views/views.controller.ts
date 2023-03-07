import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ViewsService } from './views.service';
import { ApiVersion } from '../app.constants';
// import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { RABBITMQ_SENDER } from '../rabbitmq/rabbitmq.constants';
import { Channel } from 'amqplib';
import { categoryTasks, postTasks, viewTasks } from './views.contants';

@Controller({ path: 'views', version: ApiVersion.v1 })
export class ViewsController {
  constructor(
    private readonly viewsService: ViewsService,
    // private readonly rabbitmqService: RabbitmqService,
    @Inject(RABBITMQ_SENDER) public sender: Channel,
  ) {}
  @Get()
  findAll() {
    return this.viewsService.findAll();
  }

  @Post('category_queue')
  categoryQueue() {
    // return this.rabbitmqService.addTask();
    return this.sender.sendToQueue(categoryTasks, Buffer.from('a'));
  }

  @Post('post_queue')
  postQueue() {
    // return this.rabbitmqService.addTask();
    return this.sender.sendToQueue(postTasks, Buffer.from('b'));
  }

  @Post('view_queue')
  viewQueue() {
    // return this.rabbitmqService.addTask();
    return this.sender.sendToQueue(viewTasks, Buffer.from('b'));
  }
}
