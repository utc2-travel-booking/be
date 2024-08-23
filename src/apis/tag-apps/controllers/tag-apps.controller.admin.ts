import { Body, Controller, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TagAppsService } from '../tag-apps.service';

import { Authorize } from 'src/decorators/authorize.decorator';
import _ from 'lodash';
import { Types } from 'mongoose';
import { UserPayload } from 'src/base/models/user-payload.model';
import { PERMISSIONS } from 'src/constants';
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

@Controller('tag-apps')
@ApiTags('Admin: Tag Apps')
export class TagAppsControllerAdmin {
    constructor(private readonly tagAppsService: TagAppsService) {}

    @ExtendedGet()
    @Authorize(PERMISSIONS.TAG.index)
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.tagAppsService.getAll(queryParams);
        return result;
    }

    @ExtendedGet({ route: ':id' })
    @Authorize(PERMISSIONS.TAG.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.tagAppsService.getOne(_id);
        return result;
    }

    @ExtendedPost({
        dto: CreateTagAppDto,
    })
    @Authorize(PERMISSIONS.TAG.create)
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
    @Authorize(PERMISSIONS.TAG.edit)
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
    @Authorize(PERMISSIONS.TAG.destroy)
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
