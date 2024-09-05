import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseService } from 'src/base/service/base.service';
import { COLLECTION_NAMES } from 'src/constants';
import _ from 'lodash';
import { ModuleRef } from '@nestjs/core';
import { Permission, PermissionDocument } from './entities/permissions.entity';

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
}
