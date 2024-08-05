import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { SuperCache } from 'src/packages/super-cache/decorators/super-cache.decorator';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { AppsService } from '../apps.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Authorize } from 'src/decorators/authorize.decorator';
import { COLLECTION_NAMES, PERMISSIONS_FRONT } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { App } from '../entities/apps.entity';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { appSettings } from 'src/configs/appsettings';
import { UserPayload } from 'src/base/models/user-payload.model';

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

    @Get('user-history')
    @ApiBearerAuth()
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

    @Get()
    @ApiBearerAuth()
    async getAll(
        @Query(new PagingDtoPipe<App>())
        queryParams: ExtendedPagingDto<App>,
        @Param('locale') locale: string = appSettings.mainLanguage,
    ) {
        const result = await this.appsService.getAllForFront(
            queryParams,
            {},
            locale,
        );
        return result;
    }

    @Get(':id')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS_FRONT.APP.index)
    @ApiParam({ name: 'id', type: String })
    async getAppPublish(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const result = await this.appsService.getAppPublish(_id, user);
        return result;
    }
}
