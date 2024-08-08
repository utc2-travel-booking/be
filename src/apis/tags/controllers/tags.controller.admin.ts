import { Body, Controller, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TagsService } from '../tags.service';
import _ from 'lodash';
import { Types } from 'mongoose';
import {
    DefaultGet,
    DefaultPost,
    DefaultPut,
    DefaultDelete,
} from 'src/base/controllers/base.controller';
import { UserPayload } from 'src/base/models/user-payload.model';
import { PERMISSIONS } from 'src/constants';
import { Authorize } from 'src/decorators/authorize.decorator';
import {
    PagingDtoPipe,
    ExtendedPagingDto,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { removeDiacritics } from 'src/utils/helper';
import { Tag } from '../entities/tags.entity';
import { CreateTagDto } from '../dto/create-tags.dto';
import { UpdateTagDto } from '../dto/update-tags.dto';

@Controller('tags')
@ApiTags('Admin: Tags')
export class TagsControllerAdmin {
    constructor(private readonly tagsService: TagsService) {}

    @DefaultGet()
    @Authorize(PERMISSIONS.TAG.index)
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.tagsService.getAll(queryParams);
        return result;
    }

    @DefaultGet(':id')
    @Authorize(PERMISSIONS.TAG.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.tagsService.getOne(_id);
        return result;
    }

    @DefaultPost()
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

    @DefaultPut(':id')
    @Authorize(PERMISSIONS.TAG.edit)
    @ApiParam({ name: 'id', type: String })
    async update(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Body() updateTagDto: UpdateTagDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.tagsService.updateOneById(
            _id,
            updateTagDto,
            user,
        );

        return result;
    }

    @DefaultDelete()
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
