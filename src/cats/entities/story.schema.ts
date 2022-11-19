import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
import { Cat } from './cat.schema';

export type StoryDocument = HydratedDocument<Story>;

@Schema()
export class Story {
  @Prop({ required: true })
  text: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Cat.name,
    required: false,
  })
  cat: mongoose.Types.ObjectId;
}

export const StorySchema = SchemaFactory.createForClass(Story);
