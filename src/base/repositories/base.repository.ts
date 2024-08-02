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
    CreateWithLocale,
    FindWithLocale,
    UpdateWithLocale,
} from 'src/packages/locale';
import { COLLECTION_NAMES } from 'src/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DeleteCacheEmitEvent } from 'src/packages/super-cache/decorators/delete-cache-emit-event.decorator';
import { FindMongooseModel } from '../models/find-mongoose.model';
import { FindByIdMongooseModel } from '../models/find-by-id-mongoose.model';

@Injectable()
export class BaseRepositories<T extends Document, E> {
    constructor(
        public readonly model: Model<T>,
        private readonly entity: new () => E,
        private readonly collectionName: COLLECTION_NAMES,
        public eventEmitter: EventEmitter2,
    ) {}

    @FindWithLocale()
    @DynamicLookup()
    find(option: FindMongooseModel<T>): Promise<T[]> {
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

        return this.model.aggregate(moveFirstToLast(filterPipeline)).exec();
    }

    @FindWithLocale()
    @DynamicLookup()
    findOne(option: FindMongooseModel<T>): Promise<T | null> {
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

        return this.model
            .aggregate(moveFirstToLast(filterPipeline))
            .exec()
            .then((result) => result[0]);
    }

    @FindWithLocale()
    @DynamicLookup()
    findById(option: FindByIdMongooseModel<T>) {
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

        return this.model
            .aggregate(filterPipeline)
            .exec()
            .then((result) => result[0]);
    }

    @CreateWithLocale()
    @DeleteCacheEmitEvent()
    async create(doc: Partial<T>): Promise<T> {
        return await this.model.create(doc);
    }

    @CreateWithLocale()
    @DeleteCacheEmitEvent()
    async createMany(arrData: Array<Partial<T>>) {
        return await this.model.insertMany(arrData);
    }

    @UpdateWithLocale()
    @DeleteCacheEmitEvent()
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

    @UpdateWithLocale()
    @DeleteCacheEmitEvent()
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

    @UpdateWithLocale()
    @DeleteCacheEmitEvent()
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

    @UpdateWithLocale()
    @DeleteCacheEmitEvent()
    findByIdAndUpdate(
        id: Types.ObjectId | any,
        update: UpdateQuery<T>,
        options: QueryOptions<T> = {},
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
