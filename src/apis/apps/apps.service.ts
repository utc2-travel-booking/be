import { Injectable, UnprocessableEntityException } from '@nestjs/common';
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

@Injectable()
export class AppsService extends BaseService<AppDocument, App> {
    constructor(
        @InjectModel(COLLECTION_NAMES.APP)
        private readonly appModel: Model<AppDocument>,
        moduleRef: ModuleRef,
        private readonly userAppHistoriesService: UserAppHistoriesService,
    ) {
        super(appModel, App, COLLECTION_NAMES.APP, moduleRef);
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

        return result;
    }

    async getUserAppHistories(
        queryParams: ExtendedPagingDto<App>,
        user: UserPayload,
    ) {
        const { _id: userId } = user;
        const { page, limit, skip, filterPipeline } = queryParams;

        const total = this.userAppHistoriesService
            .countDocuments(
                {
                    deletedAt: null,
                },
                filterPipeline,
            )
            .exec();

        const userAppHistories = this.userAppHistoriesService
            .find(
                {
                    deletedAt: null,
                    'createdBy._id': userId,
                },
                filterPipeline,
            )
            .limit(limit)
            .skip(skip)
            .sort({ updatedAt: -1 })
            .exec();

        return Promise.all([userAppHistories, total]).then(
            ([result, total]) => {
                const meta = pagination(result, page, limit, total);
                const items = result.map((item) => item.app);
                return { items, meta };
            },
        );
    }
}
