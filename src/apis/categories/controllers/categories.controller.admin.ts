import { Resource } from '@libs/super-authorize';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';
import { SuperDelete } from '@libs/super-core/decorators/super-delete.decorator';
import { SuperGet } from '@libs/super-core/decorators/super-get.decorator';
import { SuperPost } from '@libs/super-core/decorators/super-post.decorator';
import { SuperPut } from '@libs/super-core/decorators/super-put.decorator';
import { Body, Controller, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import _ from 'lodash';
import { Types } from 'mongoose';
import { CategoriesService } from 'src/apis/categories/categories.service';
import { CreateCategoryDto } from 'src/apis/categories/dto/create-categories.dto';
import { UpdateCategoryDto } from 'src/apis/categories/dto/update-categories.dto';
import { UserPayload } from 'src/base/models/user-payload.model';
import { COLLECTION_NAMES } from 'src/constants';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { removeDiacritics } from 'src/utils/helper';

@Controller('categories')
@Resource('categories')
@ApiTags('Admin: Categories')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.CATEGORIES,
})
export class CategoriesControllerAdmin {
    constructor(private readonly categoriesService: CategoriesService) {}

    @SuperGet({ route: ':id' })
    @SuperAuthorize()
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.categoriesService.getOne(_id);
        return result;
    }

    @SuperGet()
    @SuperAuthorize()
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.categoriesService.getAll(queryParams);
        return result;
    }

    @SuperPost({
        dto: CreateCategoryDto,
    })
    @SuperAuthorize()
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const { name } = createCategoryDto;

        const result = await this.categoriesService.createOne(
            createCategoryDto,
            user,
            { slug: _.kebabCase(removeDiacritics(name)) },
        );

        return result;
    }

    @SuperPut({ route: ':id', dto: UpdateCategoryDto })
    @SuperAuthorize()
    @ApiParam({ name: 'id', type: String })
    async update(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.categoriesService.updateOneById(
            _id,
            updateCategoryDto,
            user,
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

        const result = await this.categoriesService.deletes(_ids, user);
        return result;
    }
}
