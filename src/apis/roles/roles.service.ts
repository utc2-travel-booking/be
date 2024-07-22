import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './entities/roles.entity';
import { Model, Types } from 'mongoose';
import { BaseService } from 'src/base/service/base.service';
import { COLLECTION_NAMES } from 'src/constants';
import { SuperCacheService } from 'src/packages/super-cache/super-cache.service';
import _ from 'lodash';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class RolesService extends BaseService<RoleDocument, Role> {
    constructor(
        @InjectModel(COLLECTION_NAMES.ROLE)
        private readonly roleModel: Model<RoleDocument>,
        private readonly SuperCacheService: SuperCacheService,
        eventEmitter: EventEmitter2,
    ) {
        super(roleModel, Role, COLLECTION_NAMES.ROLE, eventEmitter);
    }

    async findPermissionsByRole(roleId: Types.ObjectId) {
        const cachePermissions = await this.SuperCacheService.get(
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

        await this.SuperCacheService.set(`role:${roleId}`, permissions);

        return permissions;
    }

    async findRoleByType(type: number) {
        return this.roleModel.findOne({ type });
    }
}
