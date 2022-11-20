import {
  Cat,
  CatDocument,
  Owner,
  OwnerDocument,
} from '../../src/cats/entities';
import { faker } from '@faker-js/faker';
import { Connection, Model } from 'mongoose';
import { generateCat } from './cat';

export async function generateOwner(
  connection: Connection,
  withRelationships = {
    cats: 0,
  },
  data?: Partial<Owner>,
) {
  const OwnerModel: Model<OwnerDocument> = connection.models[Owner.name];
  const catModel: Model<CatDocument> = connection.models[Cat.name];

  const ownerData: Owner = {
    email: faker.internet.email(),
    sql_user_id: faker.datatype.number({ min: 0, max: 100 }),
    ...data,
  };

  const owner = await OwnerModel.create(ownerData);

  const cats: CatDocument[] = [];
  for (let i = 0; i < withRelationships.cats; i++) {
    cats.push(await generateCat(catModel, { owner: owner._id }));
  }

  owner.cats = cats.map((c) => {
    return c._id;
  });
  await owner.save();

  return { owner, cats };
}
