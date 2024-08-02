import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { SuperCache } from 'src/packages/super-cache/decorators/super-cache.decorator';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { AppsService } from '../apps.service';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Authorize } from 'src/decorators/authorize.decorator';
import { COLLECTION_NAMES, PERMISSIONS_FRONT } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { App } from '../entities/apps.entity';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';

@Controller('apps')
@ApiTags('Front: Apps')
@AuditLog({
    events: [
        AUDIT_EVENT.GET,
        AUDIT_EVENT.POST,
        AUDIT_EVENT.PUT,
        AUDIT_EVENT.DELETE,
    ],
    refSource: COLLECTION_NAMES.APP,
})
@SuperCache({
    mainCollectionName: COLLECTION_NAMES.APP,
    relationCollectionNames: [COLLECTION_NAMES.USER],
})
export class AppsController {
    constructor(private readonly appsService: AppsService) {}

    @Get()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS_FRONT.APP.index)
    async getAll(
        @Query(new PagingDtoPipe<App>())
        queryParams: ExtendedPagingDto<App>,
    ) {
        const result = await this.appsService.getAllForFront(queryParams);
        return result;
    }

    @Get(':id')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS_FRONT.APP.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.appsService.getOneByIdForFront(_id);
        return result;
    }
}
