import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsService } from './reviews.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { ReviewSchema } from './entities/reviews.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.REVIEW, schema: ReviewSchema },
        ]),
    ],
    controllers: [],
    providers: [ReviewsService],
    exports: [ReviewsService],
})
export class ReviewsModule {}
