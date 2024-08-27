import { Body, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TagAppsService } from '../tag-apps.service';
import _ from 'lodash';
import { Types } from 'mongoose';
import { UserPayload } from 'src/base/models/user-payload.model';
import {
    PagingDtoPipe,
    ExtendedPagingDto,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { CreateTagAppDto } from '../dto/create-tag-apps.dto';
import { UpdateTagAppDto } from '../dto/update-tag-apps.dto';
import { ExtendedPost } from '@libs/super-core/decorators/extended-post.decorator';
import { ExtendedPut } from '@libs/super-core/decorators/extended-put.decorator';
import { ExtendedGet } from '@libs/super-core/decorators/extended-get.decorator';
import { ExtendedDelete } from '@libs/super-core/decorators/extended-delete.decorator';
import { SuperController } from '@libs/super-core';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';

@SuperController('tag-apps')
@ApiTags('Admin: Tag Apps')
export class TagAppsControllerAdmin {
    constructor(private readonly tagAppsService: TagAppsService) {}

    @ExtendedGet()
    @SuperAuthorize()
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.tagAppsService.getAll(queryParams);
        return result;
    }

    @ExtendedGet({ route: ':id' })
    @SuperAuthorize()
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.tagAppsService.getOne(_id);
        return result;
    }

    @ExtendedPost({
        dto: CreateTagAppDto,
    })
    @SuperAuthorize()
    async create(
        @Body() createTagAppDto: CreateTagAppDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.tagAppsService.createOne(
            createTagAppDto,
            user,
        );
        return result;
    }

    @ExtendedPut({ route: ':id', dto: UpdateTagAppDto })
    @SuperAuthorize()
    @ApiParam({ name: 'id', type: String })
    async update(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Body() updateTagAppDto: UpdateTagAppDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.tagAppsService.updateOneById(
            _id,
            updateTagAppDto,
            user,
        );

        return result;
    }

    @ExtendedDelete()
    @SuperAuthorize()
    @ApiQuery({ name: 'ids', type: [String] })
    async deletes(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.tagAppsService.deletes(_ids, user);
        return result;
    }
}
