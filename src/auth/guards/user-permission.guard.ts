import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { User } from '../entities/user.entity';
import { META_PERMISSION } from '../decorators';

@Injectable()
export class UserPermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validPermissions: string[] = this.reflector.get(
      META_PERMISSION,
      context.getHandler(),
    );

    if (!validPermissions) return true;
    if (validPermissions.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new BadRequestException('User not found');

    // for (const role of [user.rolesStr]) {
    //   if (validPermissions.includes(role)) {
    //     return true;
    //   }
    // }

    for (const role of user.roles) {
      if (
        role.permissions.some((p) => {
          return validPermissions.includes(p.name);
        })
      ) {
        return true;
      }
    }

    throw new ForbiddenException(
      `User ${user.fullName} need a permission: [${validPermissions}]`,
    );
  }
}
