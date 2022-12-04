import { Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiVersion } from '../app.constants';
import { MessagesGateway } from './messages.gateway';

@ApiTags('Messages-Groups')
@Controller({ path: 'groups', version: ApiVersion.v1 })
export class GroupController {
  constructor(private readonly messagesGateway: MessagesGateway) {}

  @Post()
  notifyAll() {
    this.messagesGateway.wss.emit('messageFromServer', {
      fullName: 'GroupController',
      message: 'from controller',
    });
  }
}
