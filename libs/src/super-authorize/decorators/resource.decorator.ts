import { SetMetadata } from '@nestjs/common';
import { PermissionStorage } from '../storages/permission.storage';

export const RESOURCE_KEY = 'resources';
export function Resource(prefix?: string | string[]) {
    return function (target: any) {
        if (prefix) {
            SetMetadata(RESOURCE_KEY, prefix)(target);
            if (Array.isArray(prefix)) {
                prefix = prefix.join('/');
                PermissionStorage.addPrefix(prefix);
            } else {
                const prefixes = prefix.split('/');
                PermissionStorage.addPrefix(prefixes.pop());
            }
        }
    };
}
