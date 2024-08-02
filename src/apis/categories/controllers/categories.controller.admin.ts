import { Body, Controller, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { CategoriesService } from 'src/apis/categories/categories.service';
import { CategoryType } from 'src/apis/categories/constants';
import { CreateCategoryDto } from 'src/apis/categories/dto/create-categories.dto';
import { UpdateCategoryDto } from 'src/apis/categories/dto/update-categories.dto';
import { Category } from 'src/apis/categories/entities/categories.entity';
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
import { SuperCache } from 'src/packages/super-cache/decorators/super-cache.decorator';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';

@Controller('categories')
@ApiTags('Admin: Categories')
@SuperCache({
    mainCollectionName: COLLECTION_NAMES.CATEGORIES,
    relationCollectionNames: [COLLECTION_NAMES.USER],
})
@AuditLog({
    events: [
        AUDIT_EVENT.GET,
        AUDIT_EVENT.POST,
        AUDIT_EVENT.PUT,
        AUDIT_EVENT.DELETE,
    ],
    refSource: COLLECTION_NAMES.CATEGORIES,
})
export class CategoriesControllerAdmin {
    constructor(private readonly categoriesService: CategoriesService) {}

    @DefaultGet(':type')
    @Authorize(PERMISSIONS.CATEGORIES.index)
    async getAll(
        @Query(new PagingDtoPipe<Category>())
        queryParams: ExtendedPagingDto<Category>,
        @Param('type') type: CategoryType,
    ) {
        const result = await this.categoriesService.getAll(queryParams, {
            type,
        });
        return result;
    }

    @DefaultGet(':type/:id')
    @Authorize(PERMISSIONS.CATEGORIES.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Param('type') type: CategoryType,
    ) {
        const result = await this.categoriesService.getOne(_id, { type });
        return result;
    }

    @DefaultPost(':type')
    @Authorize(PERMISSIONS.CATEGORIES.create)
    async create(
        @Body() createCategoryDto: CreateCategoryDto,
        @Req() req: { user: UserPayload },
        @Param('type') type: CategoryType,
    ) {
        const { user } = req;

        const result = await this.categoriesService.createOne(
            createCategoryDto,
            user,
            { type },
        );

        return result;
    }

    @DefaultPut(':type/:id')
    @Authorize(PERMISSIONS.CATEGORIES.edit)
    @ApiParam({ name: 'id', type: String })
    async update(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Body() updateCategoryDto: UpdateCategoryDto,
        @Param('type') type: CategoryType,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.categoriesService.updateOneByIdAndType(
            _id,
            type,
            updateCategoryDto,
            user,
        );
        return result;
    }

    @DefaultDelete(':type')
    @Authorize(PERMISSIONS.CATEGORIES.destroy)
    @ApiQuery({ name: 'ids', type: [String] })
    async deletes(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Param('type') type: CategoryType,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.categoriesService.deleteManyByIdsAndType(
            _ids,
            type,
            user,
        );
        return result;
    }
}
