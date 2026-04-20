import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      return false;
    }

    // Check if user has the required permissions
    // This includes permissions from roles and direct user permissions
    const userPermissions = new Set<string>();

    // Add permissions from roles
    if (user.roles && Array.isArray(user.roles)) {
      user.roles.forEach((role) => {
        if (role.permissions && Array.isArray(role.permissions)) {
          role.permissions.forEach((permission) => {
            userPermissions.add(permission.name);
          });
        }
      });
    }

    // Add direct user permissions
    if (user.permissions && Array.isArray(user.permissions)) {
      user.permissions.forEach((permission) => {
        userPermissions.add(permission.name);
      });
    }

    // Check if user has at least one of the required permissions
    return requiredPermissions.some((permission) =>
      userPermissions.has(permission),
    );
  }
}
