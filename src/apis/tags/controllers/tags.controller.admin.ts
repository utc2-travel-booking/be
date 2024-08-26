import { Body, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TagsService } from '../tags.service';
import _ from 'lodash';
import { Types } from 'mongoose';
import { UserPayload } from 'src/base/models/user-payload.model';
import { COLLECTION_NAMES, PERMISSIONS } from 'src/constants';
import { Authorize } from 'src/decorators/authorize.decorator';
import {
    PagingDtoPipe,
    ExtendedPagingDto,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { removeDiacritics } from 'src/utils/helper';
import { CreateTagDto } from '../dto/create-tags.dto';
import { UpdateTagDto } from '../dto/update-tags.dto';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { ExtendedPost } from '@libs/super-core/decorators/extended-post.decorator';
import { ExtendedPut } from '@libs/super-core/decorators/extended-put.decorator';
import { ExtendedDelete } from '@libs/super-core/decorators/extended-delete.decorator';
import { ExtendedGet } from '@libs/super-core/decorators/extended-get.decorator';
import { SuperController } from '@libs/super-core';

@SuperController('tags')
@ApiTags('Admin: Tags')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.TAG,
})
export class TagsControllerAdmin {
    constructor(private readonly tagsService: TagsService) {}

    @ExtendedGet()
    @Authorize(PERMISSIONS.TAG.index)
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.tagsService.getAll(queryParams);
        return result;
    }

    @ExtendedGet({ route: ':id' })
    @Authorize(PERMISSIONS.TAG.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.tagsService.getOne(_id);
        return result;
    }

    @ExtendedPost({ dto: CreateTagDto })
    @Authorize(PERMISSIONS.TAG.create)
    async create(
        @Body() createTagDto: CreateTagDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const { name } = createTagDto;

        const result = await this.tagsService.createOne(createTagDto, user, {
            slug: _.kebabCase(removeDiacritics(name)),
        });
        return result;
    }

    @ExtendedPut({ route: ':id', dto: UpdateTagDto })
    @Authorize(PERMISSIONS.TAG.edit)
    @ApiParam({ name: 'id', type: String })
    async update(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Body() updateTagDto: UpdateTagDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const { name } = updateTagDto;

        const result = await this.tagsService.updateOneById(
            _id,
            updateTagDto,
            user,
            {
                slug: _.kebabCase(removeDiacritics(name)),
            },
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

        const result = await this.tagsService.deletes(_ids, user);
        return result;
    }
}
