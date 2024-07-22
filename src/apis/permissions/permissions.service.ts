import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './entities/permissions.entity';
import { Model } from 'mongoose';
import { BaseService } from 'src/base/service/base.service';
import { COLLECTION_NAMES } from 'src/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PermissionsService extends BaseService<
    PermissionDocument,
    Permission
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.PERMISSION)
        private readonly permissionModel: Model<PermissionDocument>,
        eventEmitter: EventEmitter2,
    ) {
        super(
            permissionModel,
            Permission,
            COLLECTION_NAMES.PERMISSION,
            eventEmitter,
        );
    }
}
