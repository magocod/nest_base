import { Model } from 'mongoose';
import { Cat, CatDocument } from '../../src/cats/entities/cat.schema';
import { faker } from '@faker-js/faker';

export function generateCat(model: Model<CatDocument>, data?: Partial<Cat>) {
  const cat: Cat = {
    name: faker.animal.cat(),
    age: faker.datatype.number({ min: 1, max: 1000 }),
    breed: faker.datatype.uuid(),
    isActive: faker.datatype.boolean(),
    ...data,
  };
  return model.create(cat);
}
