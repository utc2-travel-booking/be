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
import { ReviewRating } from '../entities/review-ratings.entity';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { DefaultGet, DefaultPost } from 'src/base/controllers/base.controller';

@Controller('review-ratings')
@ApiTags('Front: Review Ratings')
@AuditLog({
    refSource: COLLECTION_NAMES.REVIEW_RATING,
    events: [
        AUDIT_EVENT.GET,
        AUDIT_EVENT.POST,
        AUDIT_EVENT.PUT,
        AUDIT_EVENT.DELETE,
    ],
})
export class ReviewRatingController {
    constructor(private readonly reviewRatingService: ReviewRatingService) {}

    @DefaultGet('overview/:appId')
    @ApiParam({ name: 'appId', type: String })
    @Authorize(PERMISSIONS_FRONT.REVIEW.index)
    async reviewRatingOverviewForApp(
        @Param('appId', ParseObjectIdPipe) appId: Types.ObjectId,
    ) {
        return await this.reviewRatingService.reviewRatingOverviewForApp(appId);
    }

    @DefaultGet(':appId')
    @ApiParam({ name: 'appId', type: String })
    async getAll(
        @Query(new PagingDtoPipe<ReviewRating>())
        queryParams: ExtendedPagingDto<ReviewRating>,
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

    @DefaultPost()
    @Authorize(PERMISSIONS_FRONT.REVIEW.create)
    async create(
        @Body() CreateReviewRatingDto: CreateReviewRatingDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.reviewRatingService.createOne(
            CreateReviewRatingDto,
            user,
        );
        return result;
    }
}
