import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { AuthModule } from '../auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './entities';
import { GroupController } from './group.controller';
import { GroupGateway } from './group.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
    AuthModule,
  ],
  controllers: [GroupController],
  providers: [MessagesGateway, MessagesService, GroupGateway],
})
export class MessagesModule {}
