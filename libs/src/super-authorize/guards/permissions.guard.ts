import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PermissionStorage } from '../storages/permission.storage';
import { PERMISSION_KEY } from '../decorators/permissions.decorator';
import { RESOURCE_KEY } from '../decorators';

const paths = PermissionStorage.getPaths();
@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<any>(
            PERMISSION_KEY,
            [context.getHandler(), context.getClass()],
        ) as string[];

        if (!requiredPermissions) {
            return true;
        }

        const resource = this.reflector.getAllAndOverride<any>(RESOURCE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]) as string[];

        const { user, _parsedUrl } = context.switchToHttp().getRequest();

        const { pathname } = _parsedUrl;

        const path = paths.find((p) => pathname.includes(p));
        return user.permissions.some(
            (permission) =>
                permission?.path === path &&
                permission?.prefix === resource &&
                requiredPermissions.includes(permission?.requestMethod),
        );
    }
}
