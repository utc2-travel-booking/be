import { Param, Query, Req, UseGuards } from '@nestjs/common';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { AppsService } from '../apps.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { COLLECTION_NAMES } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { UserPayload } from 'src/base/models/user-payload.model';
import { UserPayloadExtractorGuard } from 'src/guards/user-payload-extractor.guard';
import { MetadataType } from 'src/apis/metadata/constants';
import { SuperPost } from '@libs/super-core/decorators/super-post.decorator';
import { SuperGet } from '@libs/super-core/decorators/super-get.decorator';
import { SuperController } from '@libs/super-core';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';

@SuperController('apps')
@ApiTags('Front: Apps')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.APP,
})
export class AppsController {
    constructor(private readonly appsService: AppsService) {}

    @SuperGet({ route: 'tags/:tagSlug' })
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

    @SuperPost({ route: 'add-point/:id/:type' })
    @SuperAuthorize()
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

    @SuperGet({ route: 'user-history' })
    @SuperAuthorize()
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

    @SuperGet()
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

    @SuperGet({ route: ':id' })
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
