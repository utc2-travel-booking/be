import { MongooseModule } from '@nestjs/mongoose';
import { ReviewRatingService } from './review-ratings.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { ReviewRatingSchema } from './entities/review-ratings.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.REVIEW_RATING,
                schema: ReviewRatingSchema,
            },
        ]),
    ],
    controllers: [],
    providers: [ReviewRatingService],
    exports: [ReviewRatingService],
})
export class ReviewRatingModule {}
