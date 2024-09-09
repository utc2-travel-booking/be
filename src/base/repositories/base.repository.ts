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
} from 'mongoose';
import { DynamicLookup } from '@libs/super-search';
import _ from 'lodash';
import {
    CreateWithMultipleLanguage,
    FindWithMultipleLanguage,
    UpdateWithMultipleLanguage,
} from '@libs/super-multiple-language';
import { COLLECTION_NAMES } from 'src/constants';
import { DeleteCache } from '@libs/super-cache';
import { ModuleRef } from '@nestjs/core';
import { CustomQueryFindAllService } from '@libs/super-core/services/custom-query-find-all.service';
import { CustomQueryFindOneService } from '@libs/super-core/services/custom-query-find-one.service';
import { CustomQueryCountDocumentsService } from '@libs/super-core/services/custom-query-count-documents.service';
import { AggregateRoot } from '../entities/aggregate-root.schema';

type AnyKeys<T> = { [P in keyof T]?: T[P] | any };

@Injectable()
export class BaseRepositories<T extends AggregateRoot, E> {
    public static moduleRef: ModuleRef;

    constructor(
        public readonly model: Model<T>,
        public readonly entity: new () => E,
        public readonly collectionName: COLLECTION_NAMES,
        public moduleRef: ModuleRef,
    ) {
        BaseRepositories.moduleRef = moduleRef;
    }

    @DynamicLookup()
    @FindWithMultipleLanguage()
    find<ResultDoc = HydratedDocument<T>>(
        filter: FilterQuery<ResultDoc>,
        pipeline: PipelineStage[] = [],
    ) {
        return new CustomQueryFindAllService(
            this.model,
            this.entity,
            this.collectionName,
            this.moduleRef,
            filter,
            pipeline,
        );
    }

    @FindWithMultipleLanguage()
    @DynamicLookup()
    findOne<ResultDoc = HydratedDocument<T>>(
        filter: FilterQuery<ResultDoc>,
        pipeline: PipelineStage[] = [],
    ) {
        return new CustomQueryFindOneService(
            this.model,
            this.entity,
            this.collectionName,
            this.moduleRef,
            filter,
            pipeline,
        );
    }

    @FindWithMultipleLanguage()
    @DynamicLookup()
    findById(id: any, pipeline: PipelineStage[] = []) {
        return new CustomQueryFindOneService(
            this.model,
            this.entity,
            this.collectionName,
            this.moduleRef,
            { _id: new Types.ObjectId(id.toString()) },
            pipeline,
        );
    }

    @CreateWithMultipleLanguage()
    @DeleteCache()
    async create<DocContents = AnyKeys<T>>(doc: DocContents | T): Promise<T> {
        return await this.model.create(doc);
    }

    @CreateWithMultipleLanguage()
    @DeleteCache()
    async insertMany(docs: Array<Partial<T>>) {
        return await this.model.insertMany(docs);
    }

    @UpdateWithMultipleLanguage()
    @DeleteCache()
    async updateOne<ResultDoc = HydratedDocument<T>>(
        filter: FilterQuery<T>,
        update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
    ) {
        const result = await this.model.updateOne(
            { deletedAt: null, ...filter },
            update,
        );
        return result as unknown as ResultDoc;
    }

    @UpdateWithMultipleLanguage()
    @DeleteCache()
    async updateMany<ResultDoc = HydratedDocument<T>>(
        filter: FilterQuery<T>,
        update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
    ) {
        const result = await this.model.updateMany(
            { deletedAt: null, ...filter },
            update,
        );
        return result as unknown as ResultDoc;
    }

    @UpdateWithMultipleLanguage()
    @DeleteCache()
    async findOneAndUpdate<ResultDoc = HydratedDocument<T>>(
        filter?: FilterQuery<T>,
        update?: UpdateQuery<T>,
    ) {
        const result = await this.model.findOneAndUpdate(
            { deletedAt: null, ...filter },
            update,
        );
        return result as unknown as ResultDoc;
    }

    @UpdateWithMultipleLanguage()
    @DeleteCache()
    async findByIdAndUpdate<ResultDoc = HydratedDocument<T>>(
        id: Types.ObjectId | any,
        update: UpdateQuery<T>,
    ) {
        const result = await this.model.findByIdAndUpdate(id, update);
        return result as unknown as ResultDoc;
    }

    @DynamicLookup()
    countDocuments(filter: FilterQuery<T>, pipeline: PipelineStage[] = []) {
        return new CustomQueryCountDocumentsService(
            this.model,
            this.entity,
            this.collectionName,
            this.moduleRef,
            filter,
            pipeline,
        );
    }

    @DeleteCache()
    async deleteOne(filter: FilterQuery<T>) {
        const result = await this.model.deleteOne(filter);
        return result as unknown as T;
    }

    @DeleteCache()
    deleteMany(filter?: FilterQuery<T>) {
        return this.model.deleteMany(filter);
    }

    @DeleteCache()
    findByIdAndDelete(id?: Types.ObjectId | any) {
        return this.model.findByIdAndDelete(id);
    }
}
