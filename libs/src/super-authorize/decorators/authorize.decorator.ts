import { UseGuards, applyDecorators } from '@nestjs/common';
import { Permissions } from './permissions.decorator';
import { PermissionsGuard } from '../guards/permissions.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PERMISSION } from '../constants';

export const SuperAuthorize = (...args: PERMISSION[]) => {
    return applyDecorators(
        Permissions(...args),
        UseGuards(JwtAuthGuard, PermissionsGuard),
    );
};
