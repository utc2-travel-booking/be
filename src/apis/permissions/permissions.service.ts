import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './entities/permissions.entity';
import { Model, Types } from 'mongoose';
import { BaseService } from 'src/base/service/base.service';
import { COLLECTION_NAMES } from 'src/constants';
import { PermissionDto } from '../roles/dto/create-role.dto';
import _ from 'lodash';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class PermissionsService extends BaseService<
    PermissionDocument,
    Permission
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.PERMISSION)
        private readonly permissionModel: Model<PermissionDocument>,
        moduleRef: ModuleRef,
    ) {
        super(
            permissionModel,
            Permission,
            COLLECTION_NAMES.PERMISSION,
            moduleRef,
        );
    }

    async getAllPermissions(rolePermission: PermissionDocument[]) {
        const permissions = await this.find({}).exec();
        const groupPermissions: {
            name: string;
            admin: { [key: string]: boolean };
            front: { [key: string]: boolean };
        }[] = [];

        permissions.forEach((permission) => {
            const { collectionName, name } = permission;
            const names = name.split('.');

            let group = groupPermissions.find((x) => x.name === collectionName);

            if (!group) {
                group = {
                    name: collectionName,
                    admin: {},
                    front: {},
                };
                groupPermissions.push(group);
            }

            if (names[0] === 'admin') {
                group.admin[names.pop()] = rolePermission.find(
                    (x) => x.name === name,
                )
                    ? true
                    : false;
            } else {
                group.front[names.pop()] = rolePermission.find(
                    (x) => x.name === name,
                )
                    ? true
                    : false;
            }
        });

        return groupPermissions;
    }

    async getPermissionIdFromPayload(permissionDto: PermissionDto[]) {
        const permissions = await this.find({}).exec();

        const permissionIds: Types.ObjectId[] = [];
        permissionDto.forEach((payload: PermissionDto) => {
            const { name } = payload;

            const _permissions = permissions.filter(
                (permission) => permission.collectionName === name,
            );

            _permissions.forEach((permission) => {
                const { name, _id } = permission;
                const names = name.split('.');

                if (_.get(payload, [names[0], names.pop()], false)) {
                    permissionIds.push(_id);
                }
            });
        });

        return permissionIds;
    }
}
