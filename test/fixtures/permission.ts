import { faker } from '@faker-js/faker';
import { DataSource } from 'typeorm';

import { Permission } from '../../src/auth/entities';
import { PermissionNames } from '../../src/auth/interfaces';

export async function upsertPermission(ds: DataSource) {
  const permissionRep = ds.getRepository(Permission);

  let permissions: Permission[] = [];

  for (const name of Object.values(PermissionNames)) {
    permissions.push(
      permissionRep.create({
        name,
        description: faker.datatype.uuid(),
      }),
    );
  }
  permissions = await permissionRep.save(permissions);

  return permissions;
}

export async function generatePermission(
  ds: DataSource,
  data?: Partial<Permission>,
) {
  const permissionRep = ds.getRepository(Permission);

  let permission = permissionRep.create({
    name: faker.datatype.uuid(),
    description: faker.datatype.uuid(),
    ...data,
  });
  permission = await permissionRep.save(permission);

  return permission;
}
