import { PermissionStorage } from '@libs/super-authorize/storages/permission.storage';
import { applyDecorators, Controller } from '@nestjs/common';

export const SuperController = (prefix?: string | string[]) => {
    PermissionStorage.addPrefix(prefix);
    return applyDecorators(Controller(prefix));
};
