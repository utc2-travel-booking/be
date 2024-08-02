import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { COLLECTION_NAMES } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { SuperCache } from 'src/packages/super-cache/decorators/super-cache.decorator';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { CategoriesService } from '../categories.service';
import { Category } from 'aws-sdk/clients/cloudformation';
import { CategoryType } from '../constants';
import { DefaultGet } from 'src/base/controllers/base.controller';

@Controller('categories')
@ApiTags('Front: Categories')
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
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @DefaultGet(':type')
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
    @ApiParam({ name: 'id', type: String })
    async getOne(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Param('type') type: CategoryType,
    ) {
        const result = await this.categoriesService.getOne(_id, { type });
        return result;
    }
}
