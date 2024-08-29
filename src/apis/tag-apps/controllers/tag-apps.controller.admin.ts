import { Body, Controller, Param, Query, Req } from '@nestjs/common';
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
import { SuperPost } from '@libs/super-core/decorators/super-post.decorator';
import { SuperPut } from '@libs/super-core/decorators/super-put.decorator';
import { SuperGet } from '@libs/super-core/decorators/super-get.decorator';
import { SuperDelete } from '@libs/super-core/decorators/super-delete.decorator';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';
import { Resource } from '@libs/super-authorize';

@Controller('tag-apps')
@Resource('tag-apps')
@ApiTags('Admin: Tag Apps')
export class TagAppsControllerAdmin {
    constructor(private readonly tagAppsService: TagAppsService) {}

    @SuperGet()
    @SuperAuthorize()
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.tagAppsService.getAll(queryParams);
        return result;
    }

    @SuperGet({ route: ':id' })
    @SuperAuthorize()
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.tagAppsService.getOne(_id);
        return result;
    }

    @SuperPost({
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

    @SuperPut({ route: ':id', dto: UpdateTagAppDto })
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

    @SuperDelete()
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
