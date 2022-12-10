import { ObjectType, Field } from '@nestjs/graphql';
import { Item } from './item.type';

@ObjectType()
export class Dashboard {
  @Field(() => String)
  url: string;

  @Field(() => [Item])
  children: Item[];
}
