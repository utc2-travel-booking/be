import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from '../reviews.service';
import { Authorize } from 'src/decorators/authorize.decorator';
import { PERMISSIONS_FRONT } from 'src/constants';
import { UserPayload } from 'src/base/models/user-payload.model';
import { CreateReviewDto } from '../dto/create-review.dto';

@Controller('reviews')
@ApiTags('Front: Reviews')
export class ReviewsController {
    constructor(private readonly reviewsService: ReviewsService) {}

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
