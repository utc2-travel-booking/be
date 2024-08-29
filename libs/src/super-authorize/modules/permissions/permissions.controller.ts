import { ApiTags } from '@nestjs/swagger';
import { PermissionsService } from './permissions.service';
import { SuperGet } from '@libs/super-core';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { Controller, Query } from '@nestjs/common';
import { Resource } from '@libs/super-authorize/decorators';

@Controller('admin/permissions')
@Resource('admin/permissions')
@ApiTags('Admin: Permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @SuperGet()
    @SuperAuthorize()
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.permissionsService.getAll(queryParams);
        return result;
    }
}
