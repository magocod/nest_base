import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import { Permission, User } from '../../src/auth/entities';
import { JwtPayload } from '../../src/auth/interfaces';
import { generateRole } from './role';

export function generatePassword(): string {
  return faker.internet.password(7, false, undefined, 'aA1*');
}

export function generateAuthHeader(user: User, jwtService: JwtService) {
  const payload: JwtPayload = {
    id: user.id,
  };
  const token = jwtService.sign(payload);

  return { token, authHeader: `Bearer ${token}` };
}

export async function generateUser(ds: DataSource, data?: Partial<User>) {
  const userRep = ds.getRepository(User);

  const password = generatePassword();
  let user = userRep.create({
    email: faker.internet.email(),
    password,
    fullName: faker.name.fullName(),
    ...data,
  });
  user = await userRep.save(user);

  return { user, password };
}

export async function generateUserWith(
  ds: DataSource,
  config: { permissions: Permission[] },
  data?: Partial<User>,
) {
  const role = await generateRole(ds, { permissions: config.permissions });
  const { user, password } = await generateUser(ds, { roles: [role], ...data });
  // ...other
  return { user, password, role };
}
