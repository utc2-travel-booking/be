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
} from 'mongoose';
import { DynamicLookup } from 'src/packages/super-search';
import _ from 'lodash';
import {
    CreateWithMultipleLanguage,
    FindWithMultipleLanguage,
    UpdateWithMultipleLanguage,
} from 'src/packages/super-multiple-language';
import { COLLECTION_NAMES } from 'src/constants';
import { DeleteCache } from 'src/packages/super-cache';
import { ModuleRef } from '@nestjs/core';
import { CustomQueryFindAllService } from 'src/packages/super-core/services/custom-query-find-all.service';
import { CustomQueryFindOneService } from 'src/packages/super-core/services/custom-query-find-one.service';
import { CustomQueryCountDocumentsService } from 'src/packages/super-core/services/custom-query-count-documents.service';

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

    @DynamicLookup()
    @FindWithMultipleLanguage()
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
