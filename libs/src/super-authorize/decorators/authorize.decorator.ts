import { UseGuards, applyDecorators } from '@nestjs/common';
import { Permissions } from './permissions.decorator';
import { PermissionsGuard } from '../guards/permissions.guard';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

interface AuthorizeOptions {}

export const SuperAuthorize = () => {
    return applyDecorators(
        Permissions(),
        UseGuards(JwtAuthGuard, PermissionsGuard),
    );
};
