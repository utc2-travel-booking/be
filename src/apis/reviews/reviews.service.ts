import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { Review, ReviewDocument } from './entities/reviews.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserPayload } from 'src/base/models/user-payload.model';
import { CreateReviewDto } from './dto/create-review.dto';
import _ from 'lodash';
import { SumRatingAppModel } from '../apps/models/sum-rating-app.model';
import { APP_EVENT_HANDLER } from '../apps/constants';

@Injectable()
export class ReviewsService extends BaseService<ReviewDocument, Review> {
    constructor(
        @InjectModel(COLLECTION_NAMES.REVIEW)
        private readonly reviewModel: Model<ReviewDocument>,
        eventEmitter: EventEmitter2,
    ) {
        super(reviewModel, Review, COLLECTION_NAMES.REVIEW, eventEmitter);
    }

    async createOne(
        createReviewDto: CreateReviewDto,
        user: UserPayload,
        options?: Record<string, any>,
        locale?: string,
    ) {
        const { _id: userId } = user;
        const { app } = createReviewDto;

        await this.userJustOneReviewEachApp(userId, app);

        const result = new this.reviewModel({
            ...createReviewDto,
            ...options,
            createdBy: userId,
        });
        await this.create(result, locale);

        if (result) {
            const sumRatingAppModel: SumRatingAppModel = {
                app: _.get(result, 'app', null),
                star: _.get(result, 'star', 0),
            };
            this.eventEmitter.emit(
                APP_EVENT_HANDLER.ADD_RATING_FOR_USER,
                sumRatingAppModel,
            );
        }

        return result;
    }

    async userJustOneReviewEachApp(
        createdBy: Types.ObjectId,
        app: Types.ObjectId,
    ) {
        const review = await this.findOne({
            'createdBy._id': createdBy,
            'app._id': app,
        });

        if (review) {
            throw new BadRequestException('You have already reviewed this app');
        }
    }
}
