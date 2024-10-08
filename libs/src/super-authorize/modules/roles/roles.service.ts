import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './entities/roles.entity';
import { Model, Types } from 'mongoose';
import { BaseService } from 'src/base/service/_base.service';
import { COLLECTION_NAMES } from 'src/constants';
import { SuperCacheService } from '@libs/super-cache/super-cache.service';
import { RoleType } from './constants';
import { ModuleRef } from '@nestjs/core';
import { PermissionsService } from '@libs/super-authorize/modules/permissions/permissions.service';

@Injectable()
export class RolesService extends BaseService<RoleDocument, Role> {
    constructor(
        @InjectModel(COLLECTION_NAMES.ROLE)
        private readonly roleModel: Model<RoleDocument>,
        private readonly superCacheService: SuperCacheService,
        private readonly permissionsService: PermissionsService,
        moduleRef: ModuleRef,
    ) {
        super(roleModel, Role, COLLECTION_NAMES.ROLE, moduleRef);
    }

    async getRoleByType(type: RoleType) {
        return await this.findOne({ type }).exec();
    }

    async getOne(_id: Types.ObjectId, options?: Record<string, any>) {
        const result = await this.findOne({
            _id,
            ...options,
        }).exec();

        if (!result) {
            throw new BadRequestException(`Not found ${_id}`);
        }

        return result;
    }

    async findPermissionsByRole(roleId: Types.ObjectId) {
        const cachePermissions = await this.superCacheService.get(
            `role:${roleId}`,
        );

        if (cachePermissions) {
            return cachePermissions;
        }

        const role = await this.roleModel
            .findById(roleId)
            .populate('permissions');

        await this.superCacheService.set(`role:${roleId}`, role?.permissions);

        return role?.permissions;
    }

    async findRoleByType(type: number) {
        return this.roleModel.findOne({ type });
    }
}
