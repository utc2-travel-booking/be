import { Body, Controller, Req, Query, Param } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from '../reviews.service';
import { Authorize } from 'src/decorators/authorize.decorator';
import { COLLECTION_NAMES, PERMISSIONS_FRONT } from 'src/constants';
import { UserPayload } from 'src/base/models/user-payload.model';
import { CreateReviewDto } from '../dto/create-review.dto';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { Review } from '../entities/reviews.entity';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { DefaultGet, DefaultPost } from 'src/base/controllers/base.controller';

@Controller('reviews')
@ApiTags('Front: Reviews')
// @SuperCache({
//     mainCollectionName: COLLECTION_NAMES.REVIEW,
//     relationCollectionNames: [COLLECTION_NAMES.USER, COLLECTION_NAMES.APP],
// })
@AuditLog({
    refSource: COLLECTION_NAMES.REVIEW,
    events: [
        AUDIT_EVENT.GET,
        AUDIT_EVENT.POST,
        AUDIT_EVENT.PUT,
        AUDIT_EVENT.DELETE,
    ],
})
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @DefaultGet(':appId')
    @ApiParam({ name: 'appId', type: String })
    async getAll(
        @Query(new PagingDtoPipe<Review>())
        queryParams: ExtendedPagingDto<Review>,
        @Param('appId', ParseObjectIdPipe) appId: Types.ObjectId,
    ) {
        const result = await this.reviewsService.getAll(queryParams, {
            'app._id': appId,
        });
        return result;
    }

    @DefaultPost()
    @Authorize(PERMISSIONS_FRONT.REVIEW.create)
    async create(
        @Body() createReviewDto: CreateReviewDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.reviewsService.createOne(
            createReviewDto,
            user,
        );
        return result;
    }
}
