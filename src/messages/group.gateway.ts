import {
  WebSocketGateway,
  SubscribeMessage,
  // MessageBody,
  WebSocketServer,
  // ConnectedSocket,
} from '@nestjs/websockets';
// import { MessagesService } from './messages.service';
// import { NewMessageDto } from './dto';
// import { Server, Socket } from 'socket.io';
import { UseInterceptors, UsePipes } from '@nestjs/common';
import { WSValidationPipe } from '../common/pipes';
import { WsLoggingInterceptor } from '../common/interceptor';
import { GroupEvents, WsServer, WsSocket } from './interfaces';

@UsePipes(WSValidationPipe)
@UseInterceptors(WsLoggingInterceptor)
@WebSocketGateway({ cors: true, namespace: 'group' })
export class GroupGateway {
  @WebSocketServer() wss: WsServer;

  // constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage(GroupEvents.messageFromClientGroup)
  onMessageFromClientGroup() {
    console.log('GroupGateway event');
    this.wss.emit('messageFromServerGroup', {
      fullName: 'GroupGateway',
      message: 'from other gateway',
      group: true,
    });
  }
}
