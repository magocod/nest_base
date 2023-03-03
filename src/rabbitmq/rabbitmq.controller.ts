import { Controller, Post } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { ApiVersion } from '../app.constants';

@Controller({ path: 'rabbitmq', version: ApiVersion.v1 })
export class RabbitmqController {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  @Post('tasks')
  addTask() {
    return this.rabbitmqService.addTask();
  }

  // crash app example
  @Post('async_tasks')
  addAsyncTask() {
    return this.rabbitmqService.addAsyncTask();
  }

  @Post('sync_tasks')
  addSyncTask() {
    return this.rabbitmqService.addSyncTask();
  }

  @Post('error_sync_tasks')
  addErrorSyncTask() {
    return this.rabbitmqService.addSyncTask('error');
  }
}
