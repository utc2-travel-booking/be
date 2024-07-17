import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Authorize } from 'src/decorators/authorize.decorator';
import { PERMISSIONS_FRONT } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { Category } from './entities/categories.entity';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { CategoryType } from './constants';

@Controller('categories')
@ApiTags('Front: Categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get(':type')
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

    @Get(':type/:id')
    @ApiParam({ name: 'id', type: String })
    async getOne(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Param('type') type: CategoryType,
    ) {
        const result = await this.categoriesService.getOne(_id, { type });
        return result;
    }
}
