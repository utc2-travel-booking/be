import { Controller, Param, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { COLLECTION_NAMES } from 'src/constants';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { PostsService } from '../posts.service';
import { PostStatus, PostType } from '../constants';
import { SuperGet } from '@libs/super-core/decorators/super-get.decorator';
import { Resource } from '@libs/super-authorize';

@Controller('posts')
@Resource('posts')
@ApiTags('Front: Posts')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.FILE,
})
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @SuperGet({ route: ':type' })
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

    @SuperGet({ route: ':type/:slug' })
    @ApiParam({ name: 'slug', type: String })
    async getOne(@Param('slug') slug: string, @Param('type') type: PostType) {
        const result = await this.postsService.getOneByIdForFront(slug, {
            type,
            status: PostStatus.PUBLISHED,
        });
        return result;
    }
}
