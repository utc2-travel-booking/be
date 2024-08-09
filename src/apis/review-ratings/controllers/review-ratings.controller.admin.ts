import { Controller, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReviewRatingService } from '../review-ratings.service';
import { Authorize } from 'src/decorators/authorize.decorator';
import { COLLECTION_NAMES, PERMISSIONS } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { ReviewRating } from '../entities/review-ratings.entity';
import { Types } from 'mongoose';
import { UserPayload } from 'src/base/models/user-payload.model';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import {
    DefaultDelete,
    DefaultGet,
} from 'src/base/controllers/base.controller';

@Controller('review-ratings')
@ApiTags('Admin: Review Ratings')
@AuditLog({
    refSource: COLLECTION_NAMES.REVIEW_RATING,
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
})
export class ReviewRatingControllerAdmin {
    constructor(private readonly reviewRatingService: ReviewRatingService) {}

    @DefaultGet()
    @Authorize(PERMISSIONS.REVIEW.index)
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.reviewRatingService.getAll(queryParams);
        return result;
    }

    @DefaultGet(':id')
    @Authorize(PERMISSIONS.REVIEW.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.reviewRatingService.getOne(_id);
        return result;
    }

    @DefaultDelete()
    @Authorize(PERMISSIONS.REVIEW.destroy)
    @ApiQuery({ name: 'ids', type: [String] })
    async deletes(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.reviewRatingService.deletes(_ids, user);
        return result;
    }
}
