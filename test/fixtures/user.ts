import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';

import { User } from '../../src/auth/entities';

export async function generateUser(ds: DataSource, data?: Partial<User>) {
  const userRep = ds.getRepository(User);
  let user = userRep.create({
    email: faker.internet.email(),
    password: faker.internet.password(7, false, undefined, 'A1*'),
    fullName: faker.name.fullName(),
    ...data,
  });
  user = await userRep.save(user);

  return { user };
}
