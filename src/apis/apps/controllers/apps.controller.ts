import { Controller, Param, Query, Req, UseGuards } from '@nestjs/common';
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
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { UserPayload } from 'src/base/models/user-payload.model';
import { DefaultGet, DefaultPost } from 'src/base/controllers/base.controller';
import { UserPayloadExtractorGuard } from 'src/guards/user-payload-extractor.guard';
import { MetadataType } from 'src/apis/metadata/constants';

@Controller('apps')
@ApiTags('Front: Apps')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.APP,
})
export class AppsController {
    constructor(private readonly appsService: AppsService) {}

    @DefaultGet('tags/:tagSlug')
    @UseGuards(UserPayloadExtractorGuard)
    async getAppsByTag(
        @Param('tagSlug') tagSlug: string,
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const result = await this.appsService.getAppsByTag(
            tagSlug,
            queryParams,
            user,
        );
        return result;
    }

    @DefaultPost('add-point/:id/:type')
    @Authorize(PERMISSIONS_FRONT.APP.index)
    @ApiParam({ name: 'id', type: String })
    async addPointForUser(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Param('type') type: MetadataType,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const result = await this.appsService.addPointForUser(_id, type, user);
        return result;
    }

    @DefaultGet('user-history')
    @Authorize(PERMISSIONS_FRONT.APP.index)
    async getUserAppHistories(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
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
    @UseGuards(UserPayloadExtractorGuard)
    async getAllForFront(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const result = await this.appsService.getAllAppPublish(
            queryParams,
            user,
        );
        return result;
    }

    @DefaultGet(':id')
    @UseGuards(UserPayloadExtractorGuard)
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
