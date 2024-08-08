import { Controller, Param, Query, Req } from '@nestjs/common';

import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { AppsService } from '../apps.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Authorize } from 'src/decorators/authorize.decorator';
import { COLLECTION_NAMES, PERMISSIONS_FRONT } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { App } from '../entities/apps.entity';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { UserPayload } from 'src/base/models/user-payload.model';
import { DefaultGet } from 'src/base/controllers/base.controller';

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
export class AppsController {
    constructor(private readonly appsService: AppsService) {}

    @DefaultGet('user-history')
    @Authorize(PERMISSIONS_FRONT.APP.index)
    async getUserAppHistories(
        @Query(new PagingDtoPipe<App>())
        queryParams: ExtendedPagingDto<App>,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const result = await this.appsService.getUserAppHistories(
            queryParams,
            user,
        );
        return result;
    }

    @DefaultGet()
    async getAllForFront(
        @Query(new PagingDtoPipe<App>())
        queryParams: ExtendedPagingDto<App>,
    ) {
        const result = await this.appsService.getAllForFront(queryParams);
        return result;
    }

    @DefaultGet(':id')
    @Authorize(PERMISSIONS_FRONT.APP.index)
    @ApiParam({ name: 'id', type: String })
    async getOneAppPublish(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const result = await this.appsService.getOneAppPublish(_id, user);
        return result;
    }
}
