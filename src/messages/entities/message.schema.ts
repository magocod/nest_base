import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MessageDocument = HydratedDocument<Message>;

@Schema()
export class Message {
  @Prop({ required: true })
  text: string;

  @Prop({ required: false, default: '' })
  meta: string;

  @Prop({ required: true })
  sql_user_id: number;

  @Prop({
    required: false,
    default: () => {
      new Date();
    },
    type: Date,
  })
  createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
