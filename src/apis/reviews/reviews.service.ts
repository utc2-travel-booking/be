import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { Review, ReviewDocument } from './entities/reviews.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ReviewsService extends BaseService<ReviewDocument, Review> {
    constructor(
        @InjectModel(COLLECTION_NAMES.REVIEW)
        private readonly reviewModel: Model<ReviewDocument>,
        eventEmitter: EventEmitter2,
    ) {
        super(reviewModel, Review, COLLECTION_NAMES.REVIEW, eventEmitter);
    }
}
