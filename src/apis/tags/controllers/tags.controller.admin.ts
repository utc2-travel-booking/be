import { Body, Controller, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TagsService } from '../tags.service';
import _ from 'lodash';
import { Types } from 'mongoose';
import { UserPayload } from 'src/base/models/user-payload.model';
import { COLLECTION_NAMES } from 'src/constants';
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
import { SuperPost } from '@libs/super-core/decorators/super-post.decorator';
import { SuperPut } from '@libs/super-core/decorators/super-put.decorator';
import { SuperDelete } from '@libs/super-core/decorators/super-delete.decorator';
import { SuperGet } from '@libs/super-core/decorators/super-get.decorator';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';
import { Resource } from '@libs/super-authorize';

@Controller('tags')
@Resource('tags')
@ApiTags('Admin: Tags')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.TAG,
})
export class TagsControllerAdmin {
    constructor(private readonly tagsService: TagsService) {}

    @SuperGet()
    @SuperAuthorize()
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.tagsService.getAll(queryParams);
        return result;
    }

    @SuperGet({ route: ':id' })
    @SuperAuthorize()
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.tagsService.getOne(_id);
        return result;
    }

    @SuperPost({ dto: CreateTagDto })
    @SuperAuthorize()
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

    @SuperPut({ route: ':id', dto: UpdateTagDto })
    @SuperAuthorize()
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

    @SuperDelete()
    @SuperAuthorize()
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
