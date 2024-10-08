import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/_base.service';
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
import { pagination } from '@libs/super-search';
import { WebsocketGateway } from 'src/packages/websocket/websocket.gateway';
import { AppsService } from '../apps/apps.service';

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
        private readonly websocketGateway: WebsocketGateway,
        private readonly appService: AppsService,
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
        appId: Types.ObjectId,
    ) {
        const {
            page,
            limit,
            sortBy,
            sortDirection,
            skip,
            filterPipeline,
            select,
        } = queryParams;

        const app = await this.appService
            .findOne({
                $or: [{ _id: appId }, { slug: appId }],
            })
            .exec();

        if (!app) {
            return null;
        }

        const result = this.find(
            {
                app: app._id,
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
            .select(select)
            .exec();

        const total = this.countDocuments(
            {
                app: app._id,
            },
            filterPipeline,
        ).exec();

        return Promise.all([result, total]).then(([items, total]) => {
            const meta = pagination(items, page, limit, total);
            return { items, meta };
        });
    }

    async createOne(
        createReviewRatingDto: CreateReviewRatingDto,
        user: UserPayload,
        options?: Record<string, any>,
    ) {
        const { _id: userId } = user;
        const { app } = createReviewRatingDto;

        await this.userJustOneReviewEachApp(userId, app);

        const result = new this.reviewModel({
            ...createReviewRatingDto,
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

            await this.sendReviewRatingToClient(result._id, app);
        }

        return result;
    }

    async userJustOneReviewEachApp(
        createdBy: Types.ObjectId,
        app: Types.ObjectId,
    ) {
        const review = await this.findOne({
            createdBy: createdBy,
            app: app,
        })
            .autoPopulate(false)
            .exec();

        if (review) {
            throw new BadRequestException('You have already reviewed this app');
        }
    }

    async reviewRatingOverviewForApp(appId: Types.ObjectId) {
        const app = await this.appService
            .findOne({
                $or: [{ _id: appId }, { slug: appId }],
            })
            .exec();

        if (!app) {
            return null;
        }

        const reviews = await this.find({
            app: app._id,
        })
            .autoPopulate(false)
            .exec();

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

    private async sendReviewRatingToClient(
        reviewRatingId: Types.ObjectId,
        appId: Types.ObjectId,
    ) {
        const result = await this.findOne(
            {
                _id: new Types.ObjectId(reviewRatingId),
            },
            [
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
        ).exec();

        this.websocketGateway.sendNewReviewRating(appId, result);
    }
}
