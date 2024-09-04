import { UseGuards, applyDecorators } from '@nestjs/common';
import { Permissions } from './permissions.decorator';
import { PermissionsGuard } from '../guards/permissions.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

export const SuperAuthorize = (...args: string[]) => {
    return applyDecorators(
        Permissions(...args),
        UseGuards(JwtAuthGuard, PermissionsGuard),
    );
};
