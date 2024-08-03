import { Injectable } from '@nestjs/common';
import {
    Document,
    FilterQuery,
    Model,
    PipelineStage,
    QueryOptions,
    Types,
    UpdateQuery,
    UpdateWithAggregationPipeline,
} from 'mongoose';
import {
    DynamicLookup,
    moveFirstToLast,
    projectionConfig,
} from 'src/packages/super-search';
import _ from 'lodash';
import {
    CreateWithMultipleLanguage,
    FindWithMultipleLanguage,
    UpdateWithMultipleLanguage,
} from 'src/packages/super-multiple-language';
import { COLLECTION_NAMES } from 'src/constants';
import { FindMongooseModel } from '../models/find-mongoose.model';
import { FindByIdMongooseModel } from '../models/find-by-id-mongoose.model';
import { DeleteCache, SGetCache } from 'src/packages/super-cache';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class BaseRepositories<T extends Document, E> {
    public static moduleRef: ModuleRef;
    constructor(
        public readonly model: Model<T>,
        private readonly entity: new () => E,
        private readonly collectionName: COLLECTION_NAMES,
        public moduleRef: ModuleRef,
    ) {
        BaseRepositories.moduleRef = moduleRef;
    }

    @FindWithMultipleLanguage()
    @DynamicLookup()
    @SGetCache()
    async find(option: FindMongooseModel<T>): Promise<T[]> {
        const { filter, projection, options, filterPipeline = [] } = option;
        const { limit, skip, sort } = options || {};

        if (filter) {
            filterPipeline.push({ $match: { ...filter } });
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

        return await this.model
            .aggregate(moveFirstToLast(filterPipeline))
            .exec();
    }

    @FindWithMultipleLanguage()
    @DynamicLookup()
    @SGetCache()
    async findOne(option: FindMongooseModel<T>): Promise<T | null> {
        const { filter, projection, options, filterPipeline = [] } = option;
        const { sort } = options || {};

        if (filter) {
            filterPipeline.push({ $match: { ...filter } });
        }

        if (projection) {
            projectionConfig(filterPipeline, projection);
        }

        if (sort) {
            filterPipeline.push({ $sort: sort });
        }

        return await this.model
            .aggregate(moveFirstToLast(filterPipeline))
            .exec()
            .then((result) => result[0]);
    }

    @FindWithMultipleLanguage()
    @DynamicLookup()
    @SGetCache()
    async findById(option: FindByIdMongooseModel<T>) {
        const { id, projection, options, filterPipeline = [] } = option || {};
        const { sort } = options || {};

        filterPipeline.push({
            $match: { _id: new Types.ObjectId(id.toString()) },
        });

        if (projection) {
            projectionConfig(filterPipeline, projection);
        }

        if (sort) {
            filterPipeline.push({ $sort: sort });
        }

        return await this.model
            .aggregate(filterPipeline)
            .exec()
            .then((result) => result[0]);
    }

    @CreateWithMultipleLanguage()
    @DeleteCache()
    async create(doc: Partial<T>): Promise<T> {
        return await this.model.create(doc);
    }

    @CreateWithMultipleLanguage()
    @DeleteCache()
    createMany(arrData: Array<Partial<T>>) {
        return this.model.insertMany(arrData);
    }

    @UpdateWithMultipleLanguage()
    @DeleteCache()
    updateOne(
        filter: FilterQuery<T>,
        update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
        options?: QueryOptions<T> | null,
    ) {
        return this.model.updateOne(
            { ...filter, deletedAt: null },
            update,
            options,
        );
    }

    @UpdateWithMultipleLanguage()
    @DeleteCache()
    updateMany(
        filter: FilterQuery<T>,
        update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
        options?: QueryOptions<T> | null,
    ) {
        return this.model.updateMany(
            { ...filter, deletedAt: null },
            update,
            options,
        );
    }

    @UpdateWithMultipleLanguage()
    @DeleteCache()
    findOneAndUpdate(
        filter?: FilterQuery<T>,
        update?: UpdateQuery<T>,
        options?: QueryOptions<T> | null,
    ) {
        return this.model.findOneAndUpdate(
            { ...filter, deletedAt: null },
            update,
            options,
        );
    }

    @UpdateWithMultipleLanguage()
    @DeleteCache()
    findByIdAndUpdate(
        id: Types.ObjectId | any,
        update: UpdateQuery<T>,
        options: QueryOptions<T> = {},
    ) {
        return this.model.findByIdAndUpdate(id, update, options);
    }

    @SGetCache()
    async countDocuments(
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

        const result = await this.model.aggregate(pipeline).exec();
        return _.get(result, '[0].totalCount', 0);
    }

    @DeleteCache()
    deleteOne(filter: FilterQuery<T>, options?: QueryOptions<T>) {
        return this.model.deleteOne(filter, options);
    }

    @DeleteCache()
    deleteMany(filter?: FilterQuery<T>, options?: QueryOptions<T>) {
        return this.model.deleteMany(filter, options);
    }

    @DeleteCache()
    findByIdAndDelete(
        id?: Types.ObjectId | any,
        options?: QueryOptions<T> | null,
    ) {
        return this.model.findByIdAndDelete(id, options);
    }
}
