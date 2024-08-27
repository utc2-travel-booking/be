import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PermissionStorage } from '../storages/permission.storage';
import { PERMISSION_KEY } from '../decorators/permissions.decorator';

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

        const { user, _parsedUrl, method } = context
            .switchToHttp()
            .getRequest();

        const { pathname } = _parsedUrl;
        const pathnames = pathname.split('/');

        const path = paths.find((p) => pathname.includes(p));
        const pathIndex = pathnames.indexOf(path);

        const prefix = pathnames[pathIndex + 1];

        return user.permissions.some(
            (permission) =>
                permission?.path === path &&
                permission?.prefix === prefix &&
                permission?.requestMethod === method,
        );
    }
}
