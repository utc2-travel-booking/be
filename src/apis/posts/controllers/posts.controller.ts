import { Controller, Param, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { Post as PostEntity } from 'src/apis/posts/entities/posts.entity';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { PostsService } from '../posts.service';
import { PostStatus, PostType } from '../constants';
import { DefaultGet } from 'src/base/controllers/base.controller';

@Controller('posts')
@ApiTags('Front: Posts')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.FILE,
})
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @DefaultGet(':type')
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
        @Param('type') type: PostType,
    ) {
        const result = await this.postsService.getAllForFront(queryParams, {
            type,
            status: PostStatus.PUBLISHED,
        });
        return result;
    }

    @DefaultGet(':type/:id')
    @ApiParam({ name: 'id', type: String })
    async getOne(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Param('type') type: PostType,
    ) {
        const result = await this.postsService.getOneByIdForFront(_id, {
            type,
            status: PostStatus.PUBLISHED,
        });
        return result;
    }
}
