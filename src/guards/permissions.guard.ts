import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PERMISSION_KEY } from 'src/decorators/permissions.decorator';

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

        const { user, params } = context.switchToHttp().getRequest();
        const { type } = params;

        if (type) {
            requiredPermissions.forEach((p, index) => {
                if (p.includes('###')) {
                    requiredPermissions[index] = requiredPermissions[
                        index
                    ].replace('###', type);
                }
            });
        }

        return requiredPermissions.some((p) => user?.permissions?.includes(p));
    }
}
