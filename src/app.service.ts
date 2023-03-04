import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
// import { RabbitService, simpleTasks } from './rabbit.service';
// import { exampleTasks } from './rabbit.channel';

@Injectable()
export class AppService {
  constructor(
    private readonly dataSource: DataSource, // private readonly rabbitService: RabbitService,
  ) {}

  getHello(): string {
    // const sender = this.rabbitService.getSender();
    // sender.sendToQueue(simpleTasks, Buffer.from('something to do'));
    // sender.sendToQueue(exampleTasks, Buffer.from('something to do'));
    return 'Hello World!';
  }

  /**
   * @deprecated remove
   */
  getDataSource(): DataSource {
    return this.dataSource;
  }
}
