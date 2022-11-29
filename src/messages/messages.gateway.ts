import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
  WsException,
} from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto, NewMessageDto, UpdateMessageDto } from './dto';
// import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces';
import {
  Logger,
  UseInterceptors,
  UsePipes,
  // ValidationPipe
} from '@nestjs/common';
import { WSValidationPipe } from '../common/pipes';
import { WsLoggingInterceptor } from '../common/interceptor';
import { MessageEvents, MessageSocket, MessageWsServer } from './interfaces';

@UsePipes(WSValidationPipe)
// @UsePipes(new ValidationPipe())
@UseInterceptors(WsLoggingInterceptor)
@WebSocketGateway({ cors: true })
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: MessageWsServer;
  private readonly logger = new Logger('WS');

  constructor(
    private readonly messagesService: MessagesService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: MessageSocket) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtService.verify(token);
      await this.messagesService.registerClient(client, payload.id);
    } catch (error) {
      client.emit('exception', {
        status: 'error',
        message: 'invalid credentials',
        exception: error.message,
      });
      client.disconnect();
      return;
    }

    // console.log({ payload })
    // console.log('Cliente conectado:', client.id );
    this.logger.debug(`connected ${client.id}`);

    this.wss.emit('clientsUpdated', this.messagesService.getConnectedClients());
  }

  handleDisconnect(client: MessageSocket) {
    // console.log('Cliente desconectado', client.id )
    this.messagesService.removeClient(client.id);

    this.logger.debug(`disconnect ${client.id}`);

    this.wss.emit(
      MessageEvents.clientsUpdated,
      this.messagesService.getConnectedClients(),
    );
  }

  @SubscribeMessage(MessageEvents.messageFromClient)
  onMessageFromClient(
    @ConnectedSocket() client: MessageSocket,
    @MessageBody() payload: NewMessageDto,
  ) {
    //! Emite únicamente al cliente.
    // client.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no-message!!'
    // });

    //! Emitir a todos MENOS, al cliente inicial
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no-message!!'
    // });

    this.wss.emit('messageFromServer', {
      fullName: this.messagesService.getUserFullName(client.id),
      message: payload.message || 'no-message!!',
    });
  }

  @SubscribeMessage(MessageEvents.messageFromClientException)
  onMessageFromClientException() {
    throw new WsException('example exception.');
  }

  @SubscribeMessage(MessageEvents.createMessage)
  async create(
    @ConnectedSocket() client: MessageSocket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    createMessageDto.sql_user_id = this.messagesService.getUserId(client.id);
    const message = await this.messagesService.create(createMessageDto);

    this.wss.emit('messageFromServerMongo', {
      fullName: this.messagesService.getUserFullName(client.id),
      message,
    });
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('findOneMessage')
  findOne(@MessageBody() id: number) {
    return this.messagesService.findOne(id);
  }

  @SubscribeMessage('updateMessage')
  update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    return this.messagesService.update(updateMessageDto.id, updateMessageDto);
  }

  @SubscribeMessage('removeMessage')
  remove(@MessageBody() id: number) {
    return this.messagesService.remove(id);
  }
}
