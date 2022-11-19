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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Cat.name, schema: CatSchema },
      { name: Owner.name, schema: OwnerSchema },
      { name: Story.name, schema: StorySchema },
    ]),
  ],
  controllers: [CatsController, OwnerController],
  providers: [CatsService, StoryService, OwnerService],
})
export class CatsModule {}
