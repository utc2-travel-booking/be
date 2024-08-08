import { Controller, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuditsService } from '../audits.service';
import { Authorize } from 'src/decorators/authorize.decorator';
import { PERMISSIONS } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { DefaultGet } from 'src/base/controllers/base.controller';

@Controller('admin/audits')
@ApiTags('Admin: Audit')
export class AuditsControllerAdmin {
    constructor(private readonly auditsService: AuditsService) {}

    @DefaultGet()
    @Authorize(PERMISSIONS.AUDIT.index)
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.auditsService.getAll(queryParams);
        return result;
    }

    @DefaultGet(':id')
    @Authorize(PERMISSIONS.AUDIT.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.auditsService.getOne(_id);
        return result;
    }
}
