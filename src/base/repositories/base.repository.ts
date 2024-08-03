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
    HydratedDocument,
    QueryWithHelpers,
    GetLeanResultType,
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

type MergeType<T, U> = T & U;
type AnyKeys<T> = { [P in keyof T]?: T[P] | any };

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
    async find<ResultDoc = HydratedDocument<T>>(
        option: FindMongooseModel<ResultDoc>,
    ): Promise<GetLeanResultType<T, ResultDoc, 'find'>[]> {
        this.model.find;
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
    async findOne<ResultDoc = HydratedDocument<T>>(
        option: FindMongooseModel<ResultDoc>,
    ): Promise<GetLeanResultType<T, ResultDoc, 'findOne'> | null> {
        const { filter, projection, options, filterPipeline = [] } = option;
        const { sort } = options || {};
        const _filterPipeline = [...filterPipeline];

        if (filter) {
            _filterPipeline.push({ $match: { ...filter } });
        }

        if (projection) {
            projectionConfig(_filterPipeline, projection);
        }

        if (sort) {
            _filterPipeline.push({ $sort: sort });
        }

        return await this.model
            .aggregate(moveFirstToLast(_filterPipeline))
            .exec()
            .then((result) => result[0]);
    }

    @FindWithMultipleLanguage()
    @DynamicLookup()
    @SGetCache()
    async findById<ResultDoc = HydratedDocument<T>>(
        option: FindByIdMongooseModel<ResultDoc>,
    ): Promise<GetLeanResultType<T, ResultDoc, 'findOne'> | null> {
        const { id, projection, options, filterPipeline = [] } = option || {};
        const { sort } = options || {};
        const _filterPipeline = [...filterPipeline];

        _filterPipeline.push({
            $match: { _id: new Types.ObjectId(id.toString()) },
        });

        if (projection) {
            projectionConfig(filterPipeline, projection);
        }

        if (sort) {
            _filterPipeline.push({ $sort: sort });
        }

        const result = await this.model.aggregate(_filterPipeline).exec();
        return result[0] || null;
    }

    @CreateWithMultipleLanguage()
    @DeleteCache()
    async create<DocContents = AnyKeys<T>>(
        doc: DocContents | T,
    ): Promise<HydratedDocument<T>> {
        return await this.model.create(doc);
    }

    @CreateWithMultipleLanguage()
    @DeleteCache()
    async insertMany<DocContents = T>(
        docs: Array<T>,
    ): Promise<Array<MergeType<T, Omit<DocContents, '_id'>>>> {
        const insertedDocs = await this.model.insertMany(docs);

        return insertedDocs.map((doc) => {
            const { _id, ...rest } = doc.toObject();
            return rest as MergeType<T, Omit<DocContents, '_id'>>;
        });
    }

    @UpdateWithMultipleLanguage()
    @DeleteCache()
    async updateOne<ResultDoc = HydratedDocument<T>>(
        filter: FilterQuery<T>,
        update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
        options?: QueryOptions<T> | null,
    ): Promise<QueryWithHelpers<ResultDoc, T>> {
        const result = await this.model.updateOne(filter, update, options);
        return result as unknown as ResultDoc;
    }

    @UpdateWithMultipleLanguage()
    @DeleteCache()
    async updateMany<ResultDoc = HydratedDocument<T>>(
        filter: FilterQuery<T>,
        update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
        options?: QueryOptions<T> | null,
    ): Promise<QueryWithHelpers<ResultDoc, T>> {
        const result = await this.model.updateMany(filter, update, options);
        return result as unknown as ResultDoc;
    }

    @UpdateWithMultipleLanguage()
    @DeleteCache()
    async findOneAndUpdate<ResultDoc = HydratedDocument<T>>(
        filter?: FilterQuery<T>,
        update?: UpdateQuery<T>,
        options?: QueryOptions<T> | null,
    ): Promise<QueryWithHelpers<ResultDoc, T> | null> {
        const result = await this.model.findOneAndUpdate(
            filter,
            update,
            options,
        );
        return result as unknown as ResultDoc;
    }

    @UpdateWithMultipleLanguage()
    @DeleteCache()
    async findByIdAndUpdate<ResultDoc = HydratedDocument<T>>(
        id: Types.ObjectId | any,
        update: UpdateQuery<T>,
        options: QueryOptions<T> = {},
    ): Promise<QueryWithHelpers<ResultDoc, T> | null> {
        const result = await this.model.findByIdAndUpdate(id, update, options);
        return result as unknown as ResultDoc;
    }

    @SGetCache()
    async countDocuments(
        filter: FilterQuery<T>,
        options?: QueryOptions<T>,
        filterPipeline?: PipelineStage[],
    ): Promise<number> {
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
    async deleteOne(
        filter: FilterQuery<T>,
        options?: QueryOptions<T>,
    ): Promise<QueryWithHelpers<T, T> | null> {
        const result = await this.model.deleteOne(filter, options);
        return result as unknown as T;
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
