import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { Post as PostEntity } from 'src/apis/posts/entities/posts.entity';
import { PostStatus, PostType } from './constants';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { appSettings } from 'src/configs/appsettings';

@Controller('posts')
@ApiTags('Front: Posts')
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
