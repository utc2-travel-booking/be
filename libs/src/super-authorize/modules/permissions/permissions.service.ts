import { Injectable } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { PermissionDocument } from './entities/permissions.entity';
import { BaseService } from 'src/base/service/base.service';
import { ExtendedInjectModel } from '@libs/super-core';
import { ExtendedModel } from '@libs/super-core/interfaces/extended-model.interface';

@Injectable()
export class PermissionsService extends BaseService<PermissionDocument> {
    constructor(
        @ExtendedInjectModel(COLLECTION_NAMES.PERMISSION)
        private readonly permissionModel: ExtendedModel<PermissionDocument>,
    ) {
        super(permissionModel);
    }
}
