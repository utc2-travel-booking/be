import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { PostType } from 'src/apis/posts/constants';
import { CreatePostDto } from 'src/apis/posts/dto/create-posts.dto';
import { UpdatePostDto } from 'src/apis/posts/dto/update-posts.dto';
import { Post as PostEntity } from 'src/apis/posts/entities/posts.entity';
import { PostsService } from 'src/apis/posts/posts.service';
import { UserPayload } from 'src/base/models/user-payload.model';
import { appSettings } from 'src/configs/appsettings';
import { COLLECTION_NAMES, PERMISSIONS } from 'src/constants';
import { Authorize } from 'src/decorators/authorize.decorator';
import { SuperCache } from 'src/packages/super-cache/decorators/super-cache.decorator';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';

@Controller('posts')
@ApiTags('Admin: Posts')
@SuperCache({
    mainCollectionName: COLLECTION_NAMES.POST,
    relationCollectionNames: [
        COLLECTION_NAMES.USER,
        COLLECTION_NAMES.FILE,
        COLLECTION_NAMES.CATEGORIES,
    ],
})
export class PostsController {
    constructor(private readonly postsService: PostsService) {}

    @Get(':type')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.POST.index)
    @ApiParam({
        name: 'locale',
        required: false,
        type: String,
        description: 'The locale of the content',
    })
    async getAll(
        @Query(new PagingDtoPipe<PostEntity>())
        queryParams: ExtendedPagingDto<PostEntity>,
        @Param('type') type: PostType,
        @Param('locale') locale: string = appSettings.mainLanguage,
    ) {
        const result = await this.postsService.getAll(
            queryParams,
            { type },
            locale,
        );

        return result;
    }

    @Get(':type/:id')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.POST.index)
    @ApiParam({ name: 'id', type: String })
    @ApiParam({
        name: 'locale',
        required: false,
        type: String,
        description: 'The locale of the content',
    })
    async getOne(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Param('type') type: PostType,
        @Param('locale') locale: string = appSettings.mainLanguage,
    ) {
        const result = await this.postsService.getOne(_id, { type }, locale);
        return result;
    }

    @Post(':type')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.POST.create)
    @ApiParam({
        name: 'locale',
        required: false,
        type: String,
        description: 'The locale of the content',
    })
    async create(
        @Body() createPostDto: CreatePostDto,
        @Req() req: { user: UserPayload },
        @Param('type') type: PostType,
        @Param('locale') locale: string = appSettings.mainLanguage,
    ) {
        const { user } = req;
        const result = await this.postsService.createByType(
            createPostDto,
            type,
            locale,
            user,
            {
                type,
            },
        );
        return result;
    }

    @Put(':type/:id')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.POST.edit)
    @ApiParam({ name: 'id', type: String })
    @ApiParam({
        name: 'locale',
        required: false,
        type: String,
        description: 'The locale of the content',
    })
    async update(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Body() updatePostDto: UpdatePostDto,
        @Param('type') type: PostType,
        @Req() req: { user: UserPayload },
        @Param('locale') locale: string = appSettings.mainLanguage,
    ) {
        const { user } = req;

        const result = await this.postsService.updateOneByIdAndType(
            _id,
            type,
            locale,
            updatePostDto,
            user,
        );

        return result;
    }

    @Delete(':type')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.POST.destroy)
    @ApiQuery({ name: 'ids', type: [String] })
    async deletes(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Param('type') type: PostType,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const result = await this.postsService.deleteManyByIdsAndType(
            _ids,
            type,
            user,
        );
        return result;
    }
}
