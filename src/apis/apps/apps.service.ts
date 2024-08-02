import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { App, AppDocument } from './entities/apps.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, PipelineStage, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SumRatingAppModel } from './models/sum-rating-app.model';
import { activePublications } from 'src/base/aggregates/active-publications.aggregates';
import { UserAppHistoriesService } from '../user-app-histories/user-app-histories.service';
import { UserPayload } from 'src/base/models/user-payload.model';
import { ExtendedPagingDto } from 'src/pipes/page-result.dto.pipe';
import _ from 'lodash';
import { pagination } from 'src/packages/super-search';

@Injectable()
export class AppsService extends BaseService<AppDocument, App> {
    constructor(
        @InjectModel(COLLECTION_NAMES.APP)
        private readonly appModel: Model<AppDocument>,
        eventEmitter: EventEmitter2,
        private readonly userAppHistoriesService: UserAppHistoriesService,
    ) {
        super(appModel, App, COLLECTION_NAMES.APP, eventEmitter);
    }

    async sumTotalRating(sumRatingAppModel: SumRatingAppModel) {
        const { app, star } = sumRatingAppModel;
        const user = await this.findOne({ filter: { _id: app } });

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

    async getAppPublish(_id: Types.ObjectId, userPayload: UserPayload) {
        const { _id: userId } = userPayload;
        const filterPipeline: PipelineStage[] = [];
        activePublications(filterPipeline);

        const result = await this.findOne({
            filter: {
                _id,
                deletedAt: null,
            },
            filterPipeline,
        });

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
        const { page, limit, sortBy, sortDirection, skip, filterPipeline } =
            queryParams;

        const total = this.userAppHistoriesService.countDocuments(
            {
                deletedAt: null,
            },
            null,
            filterPipeline,
        );

        const userAppHistories = this.userAppHistoriesService.find({
            filter: {
                deletedAt: null,
                'createdBy._id': userId,
            },
            options: { limit, skip, sort: { updatedAt: -1 } },
            filterPipeline,
        });

        return Promise.all([userAppHistories, total]).then(
            ([result, total]) => {
                const totalCount = _.get(total, '[0].totalCount', 0);
                const meta = pagination(result, page, limit, totalCount);
                const items = result.map((item) => item.app);
                return { items, meta };
            },
        );
    }
}
