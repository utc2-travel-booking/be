import { Body, Controller, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { PostType } from 'src/apis/posts/constants';
import { CreatePostDto } from 'src/apis/posts/dto/create-posts.dto';
import { UpdatePostDto } from 'src/apis/posts/dto/update-posts.dto';
import { Post as PostEntity } from 'src/apis/posts/entities/posts.entity';
import { PostsService } from 'src/apis/posts/posts.service';
import {
    DefaultDelete,
    DefaultGet,
    DefaultPost,
    DefaultPut,
} from 'src/base/controllers/base.controller';
import { UserPayload } from 'src/base/models/user-payload.model';
import { COLLECTION_NAMES, PERMISSIONS } from 'src/constants';
import { Authorize } from 'src/decorators/authorize.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';

@Controller('posts')
@ApiTags('Admin: Posts')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.POST,
})
export class PostsControllerAdmin {
    constructor(private readonly postsService: PostsService) {}

    @DefaultGet(':type')
    @Authorize(PERMISSIONS.POST.index)
    @ApiParam({
        name: 'locale',
        required: false,
        type: String,
        description: 'The locale of the content',
    })
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
        @Param('type') type: PostType,
    ) {
        const result = await this.postsService.getAll(queryParams, { type });

        return result;
    }

    @DefaultGet(':type/:id')
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
    ) {
        const result = await this.postsService.getOne(_id, { type });
        return result;
    }

    @DefaultPost(':type')
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
    ) {
        const { user } = req;
        const result = await this.postsService.createByType(
            createPostDto,
            type,
            user,
            {
                type,
            },
        );
        return result;
    }

    @DefaultPut(':type/:id')
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
    ) {
        const { user } = req;

        const result = await this.postsService.updateOneByIdAndType(
            _id,
            type,
            updatePostDto,
            user,
        );

        return result;
    }

    @DefaultDelete(':type')
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
