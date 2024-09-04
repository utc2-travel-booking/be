import _ from 'lodash';
import { PermissionMetadata } from '../metadata/permission.interface';

export class PermissionStorageHost {
    private permissions = new Array<PermissionMetadata>();
    private pathPrefixes = new Array<string>();
    private prefixes = new Array<string>();

    addPaths(paths: string[]) {
        this.pathPrefixes.push(...paths);
    }

    getPaths(): string[] {
        return this.pathPrefixes;
    }

    addPrefix(prefix: string | string[]) {
        const newPrefixes = Array.isArray(prefix) ? prefix : [prefix];
        this.prefixes = _.union(this.prefixes, newPrefixes);
    }

    getPermissionMetadata(): PermissionMetadata[] {
        if (this.permissions.length === 0) {
            for (const prefix of this.prefixes) {
                this.pathPrefixes.forEach((path) => {
                    this.permissions.unshift({
                        path,
                        prefix: prefix,
                        requestMethod: 'GET',
                    });
                    this.permissions.unshift({
                        path,
                        prefix,
                        requestMethod: 'POST',
                    });
                    this.permissions.unshift({
                        path,
                        prefix,
                        requestMethod: 'PUT',
                    });
                    this.permissions.unshift({
                        path,
                        prefix,
                        requestMethod: 'DELETE',
                    });
                });
            }
        }

        return this.permissions;
    }
}

const globalRef: {
    PermissionStorage?: PermissionStorageHost;
} = global as any;

export const PermissionStorage =
    globalRef.PermissionStorage || new PermissionStorageHost();
globalRef.PermissionStorage = PermissionStorage;
