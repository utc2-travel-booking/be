import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { Post as PostEntity } from 'src/apis/posts/entities/posts.entity';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { appSettings } from 'src/configs/appsettings';
import { SuperCache } from 'src/packages/super-cache/decorators/super-cache.decorator';
import { COLLECTION_NAMES } from 'src/constants';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { PostsService } from '../posts.service';
import { PostStatus, PostType } from '../constants';

@Controller('posts')
@ApiTags('Front: Posts')
@SuperCache({
    mainCollectionName: COLLECTION_NAMES.POST,
    relationCollectionNames: [
        COLLECTION_NAMES.USER,
        COLLECTION_NAMES.FILE,
        COLLECTION_NAMES.CATEGORIES,
    ],
})
@AuditLog({
    events: [
        AUDIT_EVENT.GET,
        AUDIT_EVENT.POST,
        AUDIT_EVENT.PUT,
        AUDIT_EVENT.DELETE,
    ],
    refSource: COLLECTION_NAMES.FILE,
})
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get(':type')
    async getAll(
        @Query(new PagingDtoPipe<PostEntity>())
        queryParams: ExtendedPagingDto<PostEntity>,
        @Param('type') type: PostType,
        @Param('locale') locale: string = appSettings.mainLanguage,
    ) {
        const result = await this.postsService.getAllForFront(
            queryParams,
            {
                type,
                status: PostStatus.PUBLISHED,
            },
            locale,
        );
        return result;
    }

    @Get(':type/:id')
    @ApiParam({ name: 'id', type: String })
    async getOne(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Param('type') type: PostType,
        @Param('locale') locale: string = appSettings.mainLanguage,
    ) {
        const result = await this.postsService.getOneByIdForFront(
            _id,
            {
                type,
                status: PostStatus.PUBLISHED,
            },
            locale,
        );
        return result;
    }
}
