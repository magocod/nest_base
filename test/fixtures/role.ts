import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';

import { Role } from '../../src/auth/entities';

export async function generateRole(ds: DataSource, data?: Partial<Role>) {
  const roleRep = ds.getRepository(Role);

  let role = roleRep.create({
    name: faker.datatype.uuid(),
    description: faker.datatype.uuid(),
    ...data,
  });
  role = await roleRep.save(role);

  return role;
}
