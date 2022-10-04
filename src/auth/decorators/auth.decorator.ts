import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
// import { UserRoleGuard } from '../guards/user-role.guard';
import { UserPermissionGuard } from '../guards/user-permission.guard';
// import { ValidRoles } from '../interfaces';
import { PermissionNames } from '../interfaces';
// import { RoleProtected } from './role-protected.decorator';
import { PermissionProtected } from './permission-protected.decorator';

export function Auth(...permissions: PermissionNames[]) {
  return applyDecorators(
    PermissionProtected(...permissions),
    UseGuards(AuthGuard(), UserPermissionGuard),
  );
}
