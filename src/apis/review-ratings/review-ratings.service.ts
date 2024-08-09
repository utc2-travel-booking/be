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
import { ExtendedPagingDto } from 'src/pipes/page-result.dto.pipe';
import { pagination } from 'src/packages/super-search';

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

    async getAllForFront(
        queryParams: ExtendedPagingDto,
        options?: Record<string, any>,
    ) {
        const { page, limit, sortBy, sortDirection, skip, filterPipeline } =
            queryParams;

        const result = this.find(
            {
                ...options,
                deletedAt: null,
            },
            [
                ...filterPipeline,
                {
                    $lookup: {
                        from: 'files',
                        localField: 'createdBy.avatar',
                        foreignField: '_id',
                        as: 'createdBy.avatar',
                    },
                },
                {
                    $unwind: {
                        path: '$createdBy.avatar',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ],
        )
            .limit(limit)
            .skip(skip)
            .sort({ [sortBy]: sortDirection })
            .exec();

        const total = this.countDocuments(
            {
                ...options,
                deletedAt: null,
            },
            filterPipeline,
        ).exec();

        return Promise.all([result, total]).then(([items, total]) => {
            const meta = pagination(items, page, limit, total);
            return { items, meta };
        });
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
            'createdBy._id': createdBy,
            'app._id': app,
        }).exec();

        if (review) {
            throw new BadRequestException('You have already reviewed this app');
        }
    }

    async reviewRatingOverviewForApp(appId: Types.ObjectId) {
        const reviews = await this.find({
            'app._id': appId,
        }).exec();

        const totalReviews = reviews.length;
        const starRatingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

        reviews.forEach((review) => {
            starRatingDistribution[review.star] += 1;
        });

        const avgRating =
            reviews.reduce((acc, review) => acc + review.star, 0) /
            totalReviews;

        return {
            totalReviews,
            avgRating,
            starRatingDistribution,
        };
    }
}
