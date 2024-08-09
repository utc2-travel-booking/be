import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './entities/roles.entity';
import { Model, Types } from 'mongoose';
import { BaseService } from 'src/base/service/base.service';
import { COLLECTION_NAMES } from 'src/constants';
import { SuperCacheService } from 'src/packages/super-cache/super-cache.service';
import _ from 'lodash';
import { PermissionsService } from '../permissions/permissions.service';
import { UserPayload } from 'src/base/models/user-payload.model';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleType } from './constants';
import { ModuleRef } from '@nestjs/core';

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
        return this.roleModel.findOne({ type });
    }

    async getOne(_id: Types.ObjectId, options?: Record<string, any>) {
        const result = await this.findOne({
            _id,
            ...options,
            deletedAt: null,
        }).exec();

        const { permissions } = result;

        const getAllPermissions =
            await this.permissionsService.getAllPermissions(permissions);

        return { ...result, permissions: getAllPermissions };
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

        const permissions = role?.permissions.map((permission) => {
            return _.get(permission, 'name');
        });

        await this.superCacheService.set(`role:${roleId}`, permissions);

        return permissions;
    }

    async createOne(
        createRoleDto: CreateRoleDto,
        user: UserPayload,
        options?: Record<string, any>,
    ) {
        const { _id: userId } = user;
        const { permissions: permissionsDto } = createRoleDto;

        const permissions =
            await this.permissionsService.getPermissionIdFromPayload(
                permissionsDto,
            );

        const result = new this.roleModel({
            ...createRoleDto,
            ...options,
            permissions,
            createdBy: userId,
        });
        await this.create(result);

        return result;
    }

    async updateOneById(
        _id: Types.ObjectId,
        updateRoleDto: UpdateRoleDto,
        user: UserPayload,
    ) {
        const { _id: userId } = user;
        const { permissions: permissionsDto } = updateRoleDto;

        const permissions =
            await this.permissionsService.getPermissionIdFromPayload(
                permissionsDto,
            );

        const result = await this.findOneAndUpdate(
            { _id },
            { ...updateRoleDto, permissions, updatedBy: userId },
            { new: true },
        );

        if (!result) {
            throw new BadRequestException(`Not found ${_id}`);
        }

        return result;
    }

    async findRoleByType(type: number) {
        return this.roleModel.findOne({ type });
    }
}
