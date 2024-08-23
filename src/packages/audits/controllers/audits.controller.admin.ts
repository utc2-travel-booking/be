import { Controller, Param, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuditsService } from '../audits.service';
import { Authorize } from 'src/decorators/authorize.decorator';
import { PERMISSIONS } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';

import { ExtendedGet } from '@libs/super-core/decorators/extended-get.decorator';

@Controller('admin/audits')
@ApiTags('Admin: Audit')
export class AuditsControllerAdmin {
    constructor(private readonly auditsService: AuditsService) {}

    @ExtendedGet()
    @Authorize(PERMISSIONS.AUDIT.index)
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.auditsService.getAll(queryParams);
        return result;
    }

    @ExtendedGet({ route: ':id' })
    @Authorize(PERMISSIONS.AUDIT.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.auditsService.getOne(_id);
        return result;
    }
}
