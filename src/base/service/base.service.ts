import { BadRequestException, Injectable } from '@nestjs/common';
import {
    Document,
    FilterQuery,
    Model,
    PipelineStage,
    ProjectionType,
    QueryOptions,
    Types,
    UpdateQuery,
    UpdateWithAggregationPipeline,
} from 'mongoose';
import { ExtendedPagingDto } from 'src/pipes/page-result.dto.pipe';
import {
    DynamicLookup,
    moveFirstToLast,
    pagination,
    projectionConfig,
} from 'src/packages/super-search';
import { UserPayload } from '../models/user-payload.model';
import { activePublications } from '../aggregates/active-publications.aggregates';
import _ from 'lodash';
import {
    CreateWithLocale,
    FindWithLocale,
    UpdateWithLocale,
} from 'src/packages/locale';
import { COLLECTION_NAMES } from 'src/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeleteCacheEmitEvent } from 'src/packages/super-cache/decorators/delete-cache-emit-event.decorator';

@Injectable()
export class BaseService<T extends Document, E> {
    constructor(
        private readonly model: Model<T>,
        private readonly entity: new () => E,
        private readonly collectionName: COLLECTION_NAMES,
        public eventEmitter: EventEmitter2,
    ) {
        if (!collectionName) {
            throw new Error('Collection name must be provided');
        }
    }

    async getAll(
        queryParams: ExtendedPagingDto<T>,
        options?: Record<string, any>,
        locale?: string,
    ) {
        const { page, limit, sortBy, sortDirection, skip, filterPipeline } =
            queryParams;

        const total = this.countDocuments(
            {
                ...options,
                deletedAt: null,
            },
            null,
            filterPipeline,
        );

        const result = this.find(
            {
                ...options,
                deletedAt: null,
            },
            null,
            { limit, skip, sort: { [sortBy]: sortDirection } },
            filterPipeline,
            locale,
        );

        return Promise.all([result, total]).then(([items, total]) => {
            const totalCount = _.get(total, '[0].totalCount', 0);
            const meta = pagination(items, page, limit, totalCount);
            return { items, meta };
        });
    }

    async getOne(
        _id: Types.ObjectId,
        options?: Record<string, any>,
        locale?: string,
    ): Promise<any> {
        const result = await this.findOne(
            {
                _id,
                ...options,
                deletedAt: null,
            },
            null,
            null,
            [],
            locale,
        );

        return result;
    }

    async createOne(
        payload: any,
        user: UserPayload,
        options?: Record<string, any>,
        locale?: string,
    ) {
        const { _id: userId } = user;

        const result = new this.model({
            ...payload,
            ...options,
            createdBy: userId,
        });
        await this.create(result, locale);

        return result;
    }

    async deletes(_ids: Types.ObjectId[], user: UserPayload): Promise<T[]> {
        const { _id: userId } = user;
        const data = await this.model.find({ _id: { $in: _ids } });
        await this.model.updateMany(
            { _id: { $in: _ids } },
            { deletedAt: new Date(), deletedBy: userId },
        );
        return data;
    }

    async updateOneById(
        _id: Types.ObjectId,
        payload: any,
        user: UserPayload,
        locale?: string,
    ) {
        const { _id: userId } = user;
        const result = await this.findOneAndUpdate(
            { _id },
            { ...payload, updatedBy: userId },
            { new: true },
            locale,
        );

        if (!result) {
            throw new BadRequestException(`Not found ${_id}`);
        }

        return result;
    }

    async getAllForFront(
        queryParams: ExtendedPagingDto<T>,
        options?: Record<string, any>,
        locale?: string,
    ) {
        const { page, limit, sortBy, sortDirection, skip, filterPipeline } =
            queryParams;

        activePublications(queryParams.filterPipeline);

        const total = this.countDocuments(
            {
                deletedAt: null,
                ...options,
            },
            null,
            filterPipeline,
        );

        const result = this.find(
            { deletedAt: null, ...options },
            '-longDescription',
            { limit, skip, sort: { [sortBy]: sortDirection } },
            filterPipeline,
            locale,
        );

        return Promise.all([result, total]).then(([items, total]) => {
            const totalCount = _.get(total, '[0].totalCount', 0);
            const meta = pagination(items, page, limit, totalCount);
            return { items, meta };
        });
    }

    async getOneByIdForFront(
        _id: Types.ObjectId,
        options?: Record<string, any>,
        locale?: string,
    ) {
        // const currentDate = dayjs().toDate();
        // const result = await this.findOne({
        //     _id,
        //     deletedAt: null,
        //     $or: activePublications(currentDate),
        //     ...options,
        // });
        // return result;
    }

    async delete(filter: FilterQuery<T>) {
        return await this.model.updateOne(filter, {
            deletedAt: new Date(),
        });
    }

    async unDelete(filter: FilterQuery<T>) {
        return this.model.updateMany(filter, {
            deletedAt: null,
        });
    }

    @FindWithLocale()
    @DynamicLookup()
    find(
        filter: FilterQuery<T>,
        projection?: ProjectionType<T> | null | undefined,
        options?: QueryOptions<T> | null | undefined,
        filterPipeline: PipelineStage[] = [],
        locale?: string,
    ): Promise<T[]> {
        const { limit, skip, sort } = options || {};

        if (!filter?.deletedAt) {
            filterPipeline.push({ $match: { deletedAt: null, ...filter } });
        } else {
            filterPipeline.push({ $match: filter });
        }

        if (sort) {
            filterPipeline.push({ $sort: sort });
        }

        if (limit) {
            filterPipeline.push({ $limit: limit });
        }

        if (skip) {
            filterPipeline.push({ $skip: skip });
        }

        if (projection) {
            projectionConfig(filterPipeline, projection);
        }

        return this.model.aggregate(moveFirstToLast(filterPipeline)).exec();
    }

    @FindWithLocale()
    @DynamicLookup()
    findOne(
        filter: FilterQuery<T>,
        projection?: ProjectionType<T> | null,
        options?: QueryOptions<T> | null,
        pipeline: PipelineStage[] = [],
        locale?: string,
    ): Promise<T | null> {
        const { sort } = options || {};

        if (!filter?.deletedAt) {
            pipeline.push({ $match: { deletedAt: null, ...filter } });
        } else {
            pipeline.push({ $match: filter });
        }

        if (projection) {
            projectionConfig(pipeline, projection);
        }

        if (sort) {
            pipeline.push({ $sort: sort });
        }

        return this.model
            .aggregate(pipeline)
            .exec()
            .then((result) => result[0]);
    }

    @FindWithLocale()
    @DynamicLookup()
    findById(
        id: any,
        projection?: ProjectionType<T> | null,
        options?: QueryOptions<T> | null,
        pipeline: PipelineStage[] = [],
        locale?: string,
    ) {
        pipeline.push({
            $match: { _id: new Types.ObjectId(id.toString()), deletedAt: null },
        });

        if (projection) {
            projectionConfig(pipeline, projection);
        }

        return this.model
            .aggregate(pipeline)
            .exec()
            .then((result) => result[0]);
    }

    @CreateWithLocale()
    @DeleteCacheEmitEvent()
    async create(doc: Partial<T>, locale?: string): Promise<T> {
        return await this.model.create(doc);
    }

    @CreateWithLocale()
    @DeleteCacheEmitEvent()
    async createMany(arrData: Partial<Array<T>>, locale?: string) {
        return await this.model.insertMany(arrData);
    }

    @UpdateWithLocale()
    @DeleteCacheEmitEvent()
    updateOne(
        filter: FilterQuery<T>,
        update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
        options?: QueryOptions<T> | null,
        locale?: string,
    ) {
        return this.model.updateOne(
            { ...filter, deletedAt: null },
            update,
            options,
        );
    }

    @UpdateWithLocale()
    @DeleteCacheEmitEvent()
    updateMany(
        filter: FilterQuery<T>,
        update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
        options?: QueryOptions<T> | null,
        locale?: string,
    ) {
        return this.model.updateMany(
            { ...filter, deletedAt: null },
            update,
            options,
        );
    }

    @UpdateWithLocale()
    @DeleteCacheEmitEvent()
    findOneAndUpdate(
        filter?: FilterQuery<T>,
        update?: UpdateQuery<T>,
        options?: QueryOptions<T> | null,
        locale?: string,
    ) {
        return this.model.findOneAndUpdate(
            { ...filter, deletedAt: null },
            update,
            options,
        );
    }

    @UpdateWithLocale()
    @DeleteCacheEmitEvent()
    findByIdAndUpdate(
        id: Types.ObjectId | any,
        update: UpdateQuery<T>,
        options: QueryOptions<T> = {},
        locale?: string,
    ) {
        return this.model.findByIdAndUpdate(id, update, options);
    }

    countDocuments(
        filter: FilterQuery<T>,
        options?: QueryOptions<T>,
        filterPipeline?: PipelineStage[],
    ) {
        const pipeline: PipelineStage[] = [
            { $match: { ...filter, deletedAt: null } },
        ];

        if (filterPipeline && filterPipeline.length) {
            pipeline.push(...filterPipeline);
        }

        pipeline.push({ $count: 'totalCount' });

        return this.model.aggregate(pipeline).exec();
    }

    @DeleteCacheEmitEvent()
    deleteOne(filter: FilterQuery<T>, options?: QueryOptions<T>) {
        return this.model.deleteOne(filter, options);
    }

    @DeleteCacheEmitEvent()
    deleteMany(filter?: FilterQuery<T>, options?: QueryOptions<T>) {
        return this.model.deleteMany(filter, options);
    }

    @DeleteCacheEmitEvent()
    findByIdAndDelete(
        id?: Types.ObjectId | any,
        options?: QueryOptions<T> | null,
    ) {
        return this.model.findByIdAndDelete(id, options);
    }
}
