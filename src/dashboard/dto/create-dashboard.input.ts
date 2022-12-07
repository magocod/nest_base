import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateDashboardInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
