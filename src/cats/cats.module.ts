import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import {
  Cat,
  CatSchema,
  Owner,
  OwnerSchema,
  Story,
  StorySchema,
} from './entities';
import { StoryService } from './story.service';
import { OwnerService } from './owner.service';
import { OwnerController } from './owner.controller';
import { RabbitmqModule } from '../rabbitmq/rabbitmq.module';
import { CatsChannel } from './cats.channel';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cat.name, schema: CatSchema },
      { name: Owner.name, schema: OwnerSchema },
      { name: Story.name, schema: StorySchema },
    ]),
    RabbitmqModule.forFeature(CatsModule.name, [CatsChannel]),
  ],
  controllers: [CatsController, OwnerController],
  providers: [CatsService, StoryService, OwnerService],
  exports: [MongooseModule],
})
export class CatsModule {}
