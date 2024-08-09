import {
    BadRequestException,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { App, AppDocument } from './entities/apps.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, PipelineStage, Types } from 'mongoose';
import { SumRatingAppModel } from './models/sum-rating-app.model';
import { activePublications } from 'src/base/aggregates/active-publications.aggregates';
import { UserAppHistoriesService } from '../user-app-histories/user-app-histories.service';
import { UserPayload } from 'src/base/models/user-payload.model';
import { ExtendedPagingDto } from 'src/pipes/page-result.dto.pipe';
import _ from 'lodash';
import { pagination } from 'src/packages/super-search';
import { ModuleRef } from '@nestjs/core';
import { UserService } from '../users/user.service';
import { AddPointForUserDto } from './models/add-point-for-user.model';
import { UserTransactionType } from '../user-transaction/constants';
import { TagAppsService } from '../tag-apps/tag-apps.service';
import { TagsService } from '../tags/tags.service';
import { UserTransactionService } from '../user-transaction/user-transaction.service';
import { TYPE_ADD_POINT_FOR_USER } from './constants';
import jsonwebtoken from 'jsonwebtoken';

@Injectable()
export class AppsService extends BaseService<AppDocument, App> {
    constructor(
        @InjectModel(COLLECTION_NAMES.APP)
        private readonly appModel: Model<AppDocument>,
        moduleRef: ModuleRef,
        private readonly userAppHistoriesService: UserAppHistoriesService,
        private readonly userServices: UserService,
        private readonly tagAppsService: TagAppsService,
        private readonly tagService: TagsService,
        private readonly userTransactionService: UserTransactionService,
    ) {
        super(appModel, App, COLLECTION_NAMES.APP, moduleRef);
    }

    async getAllAppPublish(
        queryParams: ExtendedPagingDto,
        authorization: string,
    ) {
        const { page, limit, sortBy, sortDirection, skip, filterPipeline } =
            queryParams;

        let userId: Types.ObjectId;
        if (authorization) {
            const [, token] = authorization.split(' ');
            const payload = jsonwebtoken.decode(token);
            const { _id } = (payload as UserPayload) || {};
            userId = new Types.ObjectId(_id);
        }

        activePublications(queryParams.filterPipeline);

        const result = await this.find({}, filterPipeline)
            .limit(limit)
            .skip(skip)
            .sort({ [sortBy]: sortDirection })
            .select({ longDescription: 0 })
            .exec();

        const total = await this.countDocuments({}, filterPipeline).exec();
        const meta = pagination(result, page, limit, total);

        const items = result.map(async (item) => {
            return {
                ...item,
                isReceivedReward: userId
                    ? await this.userTransactionService.checkReceivedReward(
                          userId,
                          item._id,
                      )
                    : false,
            };
        });

        return Promise.all(items).then((items) => {
            return { items, meta };
        });
    }

    async getAppsByTag(tagSlug: string, queryParams: ExtendedPagingDto) {
        const tag = await this.tagService.findOne({ slug: tagSlug }).exec();

        if (!tag) {
            throw new BadRequestException(`Not found tag ${tagSlug}`);
        }

        const { page, limit, skip, filterPipeline } = queryParams;

        const tagApps = this.tagAppsService
            .find(
                {
                    'tag._id': tag._id,
                },
                filterPipeline,
            )
            .limit(limit)
            .skip(skip)
            .sort({ position: 1 })
            .exec();

        const total = this.tagAppsService
            .countDocuments(
                {
                    'tag._id': tag._id,
                },
                filterPipeline,
            )
            .exec();

        return Promise.all([tagApps, total]).then(([result, total]) => {
            const meta = pagination(result, page, limit, total);
            const items = result.map((item) => item.app);
            return { items, meta };
        });
    }

    async addPointForUser(
        appId: Types.ObjectId,
        type: TYPE_ADD_POINT_FOR_USER,
        userPayload: UserPayload,
    ) {
        const app = await this.findOne({ _id: appId }).exec();

        const addPointForUserDto: AddPointForUserDto = {
            point: 10,
            type: UserTransactionType.SUM,
            app: appId,
            description: type,
        };

        return await this.userServices.addPointForUser(
            addPointForUserDto,
            app,
            userPayload,
        );
    }

    async sumTotalRating(sumRatingAppModel: SumRatingAppModel) {
        const { app, star } = sumRatingAppModel;
        const user = await this.findOne({ _id: app }).exec();

        if (!user) {
            throw new UnprocessableEntityException(
                'user_not_found',
                'User not found',
            );
        }

        const totalRating = (user.totalRating || 0) + star;
        const totalRatingCount = (user.totalRatingCount || 0) + 1;
        const avgRating = totalRating / totalRatingCount;

        await this.updateOne(
            { _id: app },
            {
                totalRating,
                totalRatingCount,
                avgRating,
            },
        );
    }

    async getOneAppPublish(_id: Types.ObjectId, userPayload: UserPayload) {
        const { _id: userId } = userPayload;
        const filterPipeline: PipelineStage[] = [];
        activePublications(filterPipeline);

        const result = await this.findOne(
            {
                _id,
                deletedAt: null,
            },
            filterPipeline,
        ).exec();

        if (!result) {
            throw new UnprocessableEntityException(
                'app_not_found',
                'App not found',
            );
        }

        await this.userAppHistoriesService.createUserAppHistory(
            result._id,
            userId,
        );

        return {
            ...result,
            isReceivedReward:
                await this.userTransactionService.checkReceivedReward(
                    userId,
                    result._id,
                ),
        };
    }

    async getUserAppHistories(
        queryParams: ExtendedPagingDto,
        user: UserPayload,
    ) {
        const { _id: userId } = user;
        const { page, limit, skip, filterPipeline } = queryParams;

        const total = await this.userAppHistoriesService
            .countDocuments(
                {
                    'createdBy._id': userId,
                },
                filterPipeline,
            )
            .exec();

        const userAppHistories = await this.userAppHistoriesService
            .find(
                {
                    'createdBy._id': userId,
                },
                [
                    ...filterPipeline,
                    {
                        $lookup: {
                            from: 'files',
                            localField: 'app.featuredImage',
                            foreignField: '_id',
                            as: 'app.featuredImage',
                        },
                    },
                    {
                        $unwind: {
                            path: '$app.featuredImage',
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                ],
            )
            .limit(limit)
            .skip(skip)
            .sort({ updatedAt: -1 })
            .exec();

        const result = userAppHistories.map((item) => item.app);

        const items = result.map(async (item) => {
            return {
                ...item,
                isReceivedReward: userId
                    ? await this.userTransactionService.checkReceivedReward(
                          userId,
                          item._id,
                      )
                    : false,
            };
        });

        return Promise.all(items).then((items) => {
            const meta = pagination(result, page, limit, total);
            return { items, meta };
        });
    }
}
