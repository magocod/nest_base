import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import mongoose from 'mongoose';
// import { Cat } from './cat.schema';

export type OwnerDocument = HydratedDocument<Owner>;

export type OwnerDocumentGeneric<T = mongoose.Types.ObjectId> =
  HydratedDocument<Owner<T>>;

@Schema()
export class Owner<T = mongoose.Types.ObjectId> {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  sql_user_id: number;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Cat', default: [] })
  cats?: T[];
}

export const OwnerSchema = SchemaFactory.createForClass(Owner);
