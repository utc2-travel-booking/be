import { Body, Controller, Post, Req, Get, Query, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from '../reviews.service';
import { Authorize } from 'src/decorators/authorize.decorator';
import { PERMISSIONS_FRONT } from 'src/constants';
import { UserPayload } from 'src/base/models/user-payload.model';
import { CreateReviewDto } from '../dto/create-review.dto';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { Review } from '../entities/reviews.entity';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';

@Controller('reviews')
@ApiTags('Front: Reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

    @Get(':appId')
    @ApiBearerAuth()
    @Authorize(PERMISSIONS_FRONT.REVIEW.index)
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

    @Post()
    @ApiBearerAuth()
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
