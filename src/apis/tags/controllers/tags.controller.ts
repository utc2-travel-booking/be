import { ApiParam, ApiTags } from '@nestjs/swagger';
import { TagsService } from '../tags.service';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { COLLECTION_NAMES } from 'src/constants';
import { Controller, Param, Query } from '@nestjs/common';
import { Resource } from '@libs/super-authorize';
import { SuperGet } from '@libs/super-core';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';

@Controller('tags')
@Resource('tags')
@ApiTags('Front: Tags')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.TAG,
})
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}

    @SuperGet()
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.tagsService.getAll(queryParams);
        return result;
    }

    @SuperGet({ route: ':id' })
    @ApiParam({ name: 'id', type: String, description: 'ID/Slug' })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.tagsService.getOne(_id);
        return result;
    }
}
