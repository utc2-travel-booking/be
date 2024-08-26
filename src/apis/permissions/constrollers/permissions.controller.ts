import { ApiTags } from '@nestjs/swagger';
import { PermissionsService } from '../permissions.service';
import { SuperController } from '@libs/super-core';

@SuperController('permissions')
@ApiTags('Admin: Permissions')
export class PermissionsControllerAdmin {
    constructor(private readonly permissionsService: PermissionsService) {}
}
