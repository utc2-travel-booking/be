import { Body, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { UserPayload } from 'src/base/models/user-payload.model';
import { COLLECTION_NAMES } from 'src/constants';
import {
    PagingDtoPipe,
    ExtendedPagingDto,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { CreateAppDto } from 'src/apis/apps/dto/create-app.dto';
import { UpdateAppDto } from 'src/apis/apps/dto/update-app.dto';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { AppsService } from '../apps.service';
import _ from 'lodash';
import { removeDiacritics } from 'src/utils/helper';
import { SuperPost } from '@libs/super-core/decorators/super-post.decorator';
import { SuperPut } from '@libs/super-core/decorators/super-put.decorator';
import { SuperGet } from '@libs/super-core/decorators/super-get.decorator';
import { SuperDelete } from '@libs/super-core/decorators/super-delete.decorator';
import { SuperController } from '@libs/super-core';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';

@SuperController('apps')
@ApiTags('Admin: Apps')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.APP,
})
export class AppsControllerAdmin {
    constructor(private readonly appsService: AppsService) {}

    @SuperGet()
    @SuperAuthorize()
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.appsService.getAll(queryParams);
        return result;
    }

    @SuperGet({ route: ':id' })
    @SuperAuthorize()
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.appsService.getOne(_id);
        return result;
    }

    @SuperPost({
        dto: CreateAppDto,
    })
    @SuperAuthorize()
    async create(
        @Body() createAppDto: CreateAppDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const { name } = createAppDto;

        const result = await this.appsService.createOne(createAppDto, user, {
            slug: _.kebabCase(removeDiacritics(name)),
        });
        return result;
    }

    @SuperPut({ route: ':id', dto: UpdateAppDto })
    @SuperAuthorize()
    @ApiParam({ name: 'id', type: String })
    async update(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Body() updateAppDto: UpdateAppDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.appsService.updateOneById(
            _id,
            updateAppDto,
            user,
        );

        return result;
    }

    @SuperDelete()
    @SuperAuthorize()
    @ApiQuery({ name: 'ids', type: [String] })
    async deletes(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.appsService.deletes(_ids, user);
        return result;
    }
}
