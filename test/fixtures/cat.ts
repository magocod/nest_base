import { Connection, Model } from 'mongoose';
import {
  Cat,
  CatDocument,
  Story,
  StoryDocument,
} from '../../src/cats/entities';
import { faker } from '@faker-js/faker';
import * as mongoose from 'mongoose';
import { generateOwner } from './owner';

export function generateCat(model: Model<CatDocument>, data?: Partial<Cat>) {
  const cat: Cat = {
    name: faker.animal.cat(),
    age: faker.datatype.number({ min: 1, max: 1000 }),
    breed: faker.datatype.uuid(),
    isActive: faker.datatype.boolean(),
    tags: faker.helpers.arrayElements(['A', 'B', 'C']),
    ...data,
  };
  return model.create(cat);
}

export async function generateCatWith(
  connection: Connection,
  withRelationships = {
    stories: 0,
    owner: false,
  },
  data?: Partial<Cat>,
) {
  const catModel: Model<CatDocument> = connection.models[Cat.name];
  const storyModel: Model<StoryDocument> = connection.models[Story.name];

  let owner: mongoose.Types.ObjectId;

  if (withRelationships.owner) {
    const ownerPayload = await generateOwner(connection);
    owner = ownerPayload.owner._id;
  }

  const catData: Cat = {
    name: faker.animal.cat(),
    age: faker.datatype.number({ min: 1, max: 1000 }),
    breed: faker.datatype.uuid(),
    isActive: faker.datatype.boolean(),
    tags: faker.helpers.arrayElements(['A', 'B', 'C']),
    ...data,
    owner,
  };
  const cat = await catModel.create(catData);

  const stories: StoryDocument[] = [];
  for (let i = 0; i < withRelationships.stories; i++) {
    stories.push(
      await storyModel.create({
        text: faker.datatype.uuid(),
        cat: cat._id,
      }),
    );
  }

  return { cat, stories };
}
