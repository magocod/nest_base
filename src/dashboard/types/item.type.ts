import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class Item {
  @Field(() => String)
  title: string;

  @Field(() => String)
  url: string;

  @Field(() => String)
  icon: string;

  @Field(() => [Item])
  children: Item[];
}
