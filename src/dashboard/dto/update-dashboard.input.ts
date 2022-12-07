import { CreateDashboardInput } from './create-dashboard.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDashboardInput extends PartialType(CreateDashboardInput) {
  @Field(() => Int)
  id: number;
}
