import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './entities/roles.entity';
import { Model, Types } from 'mongoose';
import { BaseService } from 'src/base/service/base.service';
import { COLLECTION_NAMES } from 'src/constants';
import { CacheManagerService } from 'src/packages/cache-manager/cache-manager.service';
import _ from 'lodash';

@Injectable()
export class RolesService extends BaseService<RoleDocument, Role> {
    constructor(
        @InjectModel(COLLECTION_NAMES.ROLE)
        private readonly roleModel: Model<RoleDocument>,
        private readonly cacheManagerService: CacheManagerService,
    ) {
        super(roleModel, Role);
    }

    async findPermissionsByRole(roleId: Types.ObjectId) {
        const cachePermissions = await this.cacheManagerService.get(
            `role:${roleId}`,
        );

        if (cachePermissions) {
            return cachePermissions;
        }

        const role = await this.roleModel
            .findById(roleId)
            .populate('permissions');

        const permissions = role?.permissions.map((permission) => {
            return _.get(permission, 'name');
        });

        await this.cacheManagerService.set(`role:${roleId}`, permissions);

        return permissions;
    }

    async findRoleByType(type: number) {
        return this.roleModel.findOne({ type });
    }
}
