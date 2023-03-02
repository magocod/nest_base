import { Controller, Post } from '@nestjs/common';
import { RabbitmqService } from './rabbitmq.service';
import { ApiVersion } from '../app.constants';

@Controller({ path: 'rabbitmq', version: ApiVersion.v1 })
export class RabbitmqController {
  constructor(private readonly rabbitmqService: RabbitmqService) {}

  @Post()
  create() {
    return this.rabbitmqService.add();
  }
}
