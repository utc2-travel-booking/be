import { UseGuards, applyDecorators } from '@nestjs/common';
import { Permissions } from './permissions.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionsGuard } from 'src/guards/permissions.guard';

export const Authorize = (...args: string[]) => {
    return applyDecorators(
        Permissions(...args),
        UseGuards(JwtAuthGuard, PermissionsGuard),
    );
};
