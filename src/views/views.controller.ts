import { Controller, Get, Inject, Post } from '@nestjs/common';
import { ViewsService } from './views.service';
import { ApiVersion } from '../app.constants';
// import { RabbitmqService } from '../rabbitmq/rabbitmq.service';
import { RABBITMQ_SENDER } from '../rabbitmq/rabbitmq.constants';
import { Channel } from 'amqplib';
import { viewTask } from './views.contants';

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

  @Post('queue')
  queue() {
    // return this.rabbitmqService.addTask();
    return this.sender.sendToQueue(viewTask, Buffer.from('something to do'));
  }
}
