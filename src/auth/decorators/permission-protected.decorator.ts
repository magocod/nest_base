import { SetMetadata } from '@nestjs/common';
import { PermissionNames } from '../interfaces';

export const META_PERMISSION = 'permission';

export const PermissionProtected = (...args: PermissionNames[]) => {
  return SetMetadata(META_PERMISSION, args);
};
