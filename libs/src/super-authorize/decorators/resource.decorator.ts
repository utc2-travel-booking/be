import { PermissionStorage } from '../storages/permission.storage';

export function Resource(prefix?: string | string[]) {
    return function (target: any) {
        if (prefix) {
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
