import { Body, Controller, Req, Query, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ReviewRatingService } from '../review-ratings.service';
import { Authorize } from 'src/decorators/authorize.decorator';
import { COLLECTION_NAMES, PERMISSIONS_FRONT } from 'src/constants';
import { UserPayload } from 'src/base/models/user-payload.model';
import { CreateReviewRatingDto } from '../dto/create-review-rating.dto';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';

import { ExtendedPost } from '@libs/super-core/decorators/extended-post.decorator';
import { ExtendedGet } from '@libs/super-core/decorators/extended-get.decorator';

@Controller('review-ratings')
@ApiTags('Front: Review Ratings')
@AuditLog({
    refSource: COLLECTION_NAMES.REVIEW_RATING,
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
})
export class ReviewRatingController {
    constructor(private readonly reviewRatingService: ReviewRatingService) {}

    @ExtendedGet({ route: 'overview/:appId' })
    @ApiParam({ name: 'appId', type: String })
    async reviewRatingOverviewForApp(
        @Param('appId', ParseObjectIdPipe) appId: Types.ObjectId,
    ) {
        return await this.reviewRatingService.reviewRatingOverviewForApp(appId);
    }

    @ExtendedGet({ route: ':appId' })
    @ApiParam({ name: 'appId', type: String })
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
        @Param('appId', ParseObjectIdPipe) appId: Types.ObjectId,
    ) {
        const result = await this.reviewRatingService.getAllForFront(
            queryParams,
            {
                'app._id': appId,
            },
        );
        return result;
    }

    @ExtendedPost({
        dto: CreateReviewRatingDto,
    })
    @Authorize(PERMISSIONS_FRONT.REVIEW.create)
    async create(
        @Body() createReviewRatingDto: CreateReviewRatingDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.reviewRatingService.createOne(
            createReviewRatingDto,
            user,
        );
        return result;
    }
}
