import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto, UpdateNotificationDto } from './dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities';
import { WsService } from '../ws/ws.service';
import { WS_SERVER } from '../ws/ws.contants';
// import { WebSocketServer } from 'ws';
import * as WebSocket from 'ws';
import { WebSocketServerWrapper } from '../ws/ws-server.provider';

@Auth()
@Controller('notifications')
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly wsService: WsService,
    // @Inject(WS_SERVER) private wss: WebSocketServer,
    @Inject(WS_SERVER) public wss: WebSocketServerWrapper,
  ) {}

  @Post()
  async create(
    @Body() createNotificationDto: CreateNotificationDto,
    @GetUser() user: User,
  ) {
    const notification = await this.notificationsService.create(
      createNotificationDto,
      user,
    );

    this.wsService.broadcast(JSON.stringify(notification));

    return notification;
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationsService.update(+id, updateNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationsService.remove(+id);
  }

  @Post('fake_volatile')
  sendFakeVolatileMessage() {
    return this.wsService.fakeWss.send();
  }

  @Post('volatile')
  sendVolatileMessage() {
    this.wss.getInstance().clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            message: 'notification all connected from inject(WS_SERVER)',
          }),
        );
      }
    });
  }
}
