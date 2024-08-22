import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PermissionsService } from '../permissions.service';

@Controller('permissions')
@ApiTags('Admin: Permissions')
export class PermissionsControllerAdmin {
    constructor(private readonly permissionsService: PermissionsService) {}
}
