import { Controller, Delete, Get, Param, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from '../reviews.service';
import { Authorize } from 'src/decorators/authorize.decorator';
import { COLLECTION_NAMES, PERMISSIONS } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { Review } from '../entities/reviews.entity';
import { Types } from 'mongoose';
import { UserPayload } from 'src/base/models/user-payload.model';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { SuperCache } from 'src/packages/super-cache/decorators/super-cache.decorator';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';

@Controller('reviews')
@ApiTags('Admin: Reviews')
@SuperCache({
    mainCollectionName: COLLECTION_NAMES.REVIEW,
    relationCollectionNames: [COLLECTION_NAMES.USER, COLLECTION_NAMES.APP],
})
@AuditLog({
    refSource: COLLECTION_NAMES.REVIEW,
    events: [
        AUDIT_EVENT.GET,
        AUDIT_EVENT.POST,
        AUDIT_EVENT.PUT,
        AUDIT_EVENT.DELETE,
    ],
})
export class ReviewsControllerAdmin {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get()
    @Authorize(PERMISSIONS.REVIEW.index)
    @ApiBearerAuth()
    async getAll(
        @Query(new PagingDtoPipe<Review>())
        queryParams: ExtendedPagingDto<Review>,
    ) {
        const result = await this.reviewsService.getAll(queryParams);
        return result;
    }

    @Get(':id')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.REVIEW.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.reviewsService.getOne(_id);
        return result;
    }

    @Delete()
    @ApiBearerAuth()
    @Authorize(PERMISSIONS.REVIEW.destroy)
    @ApiQuery({ name: 'ids', type: [String] })
    async deletes(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.reviewsService.deletes(_ids, user);
        return result;
    }
}
