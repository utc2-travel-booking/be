import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { PermissionsService } from './modules/permissions/permissions.service';
import { PermissionStorage } from './storages/permission.storage';
import { Permission } from './modules/permissions/entities/permissions.entity';
import { SuperAuthorizeOptions } from './super-authorize.module';

@Injectable()
export class SuperAuthorizeService implements OnModuleInit {
    constructor(
        @Inject('SUPER_AUTHORIZE_OPTIONS')
        private readonly superAuthorizeOptions: SuperAuthorizeOptions,
        private readonly permissionsService: PermissionsService,
    ) {
        PermissionStorage.addPaths(this.superAuthorizeOptions.paths);
    }

    async onModuleInit() {
        const permissionMetadata = PermissionStorage.getPermissionMetadata();
        const permissions = await this.permissionsService.find({}).exec();

        const newPermissions: Permission[] = [];
        for (const item of permissionMetadata) {
            const permission = permissions.find(
                (p) =>
                    item.path === p.path &&
                    item.prefix === p.prefix &&
                    item.requestMethod === p.requestMethod,
            );

            if (!permission) {
                newPermissions.push(item);
            }
        }

        if (newPermissions.length > 0) {
            await this.permissionsService.insertMany(newPermissions);
        }
    }
}
