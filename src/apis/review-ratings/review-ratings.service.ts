import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import {
    ReviewRating,
    ReviewRatingDocument,
} from './entities/review-ratings.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserPayload } from 'src/base/models/user-payload.model';
import { CreateReviewRatingDto } from './dto/create-review-rating.dto';
import _ from 'lodash';
import { SumRatingAppModel } from '../apps/models/sum-rating-app.model';
import { APP_EVENT_HANDLER } from '../apps/constants';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class ReviewRatingService extends BaseService<
    ReviewRatingDocument,
    ReviewRating
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.REVIEW_RATING)
        private readonly reviewModel: Model<ReviewRatingDocument>,
        moduleRef: ModuleRef,
        private readonly eventEmitter: EventEmitter2,
    ) {
        super(
            reviewModel,
            ReviewRating,
            COLLECTION_NAMES.REVIEW_RATING,
            moduleRef,
        );
    }

    async createOne(
        CreateReviewRatingDto: CreateReviewRatingDto,
        user: UserPayload,
        options?: Record<string, any>,
    ) {
        const { _id: userId } = user;
        const { app } = CreateReviewRatingDto;

        await this.userJustOneReviewEachApp(userId, app);

        const result = new this.reviewModel({
            ...CreateReviewRatingDto,
            ...options,
            createdBy: userId,
        });
        await this.create(result);

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
            filter: {
                'createdBy._id': createdBy,
                'app._id': app,
            },
        });

        if (review) {
            throw new BadRequestException('You have already reviewed this app');
        }
    }
}
