import { Inject, Injectable } from '@nestjs/common';
import { Channel } from 'amqplib';
import {
  asyncTaskQueue,
  RABBITMQ_SENDER,
  syncTaskQueue,
} from './rabbitmq.constants';
import { taskQueue } from './rabbitmq.constants';

@Injectable()
export class RabbitmqService {
  constructor(@Inject(RABBITMQ_SENDER) public sender: Channel) {}

  addTask() {
    return this.sender.sendToQueue(taskQueue, Buffer.from('something to do'));
  }

  addAsyncTask() {
    return this.sender.sendToQueue(
      asyncTaskQueue,
      Buffer.from('something to do'),
    );
  }

  addSyncTask(data = 'something to do') {
    return this.sender.sendToQueue(syncTaskQueue, Buffer.from(data));
  }
}
