import { MongooseModule } from '@nestjs/mongoose';
import { ReviewRatingService } from './review-ratings.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { ReviewRatingSchema } from './entities/review-ratings.entity';
import { WebsocketModule } from 'src/packages/websocket/websocket.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.REVIEW_RATING,
                schema: ReviewRatingSchema,
            },
        ]),
        WebsocketModule,
    ],
    controllers: [],
    providers: [ReviewRatingService],
    exports: [ReviewRatingService],
})
export class ReviewRatingModule {}
