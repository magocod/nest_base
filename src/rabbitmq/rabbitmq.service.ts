import { Inject, Injectable } from '@nestjs/common';
import { Channel } from 'amqplib';
import { RABBITMQ_SENDER } from './rabbitmq.constants';
import { taskQueue } from '../rabbit.service';

@Injectable()
export class RabbitmqService {
  constructor(@Inject(RABBITMQ_SENDER) public sender: Channel) {}

  add() {
    return this.sender.sendToQueue(taskQueue, Buffer.from('something to do'));
  }
}
