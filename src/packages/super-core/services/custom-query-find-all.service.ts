import { ModuleRef } from '@nestjs/core';
import { Model, PipelineStage, Document, Expression } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { SGetCache } from '../../super-cache';
import { deleteAllLookup, sortPipelines } from '../../super-search';
import { ICustomQueryFindAll } from './interfaces/custom-query-find-all.interface';

export class CustomQueryFindAllService<T extends Document>
    implements ICustomQueryFindAll<T>
{
    private id: string;
    private collectionName: COLLECTION_NAMES;
    private model: Model<T>;
    private _conditions: Record<string, any> = {};
    private _pipeline: PipelineStage[] = [];
    public static moduleRef: ModuleRef;
    private _entity: new () => any;

    constructor(
        model: Model<T>,
        entity: new () => any,
        collectionName: COLLECTION_NAMES,
        moduleRef: ModuleRef,
        conditions: Record<string, any> = {},
        pipeline: PipelineStage[] = [],
    ) {
        this.id = CustomQueryFindAllService.name;
        CustomQueryFindAllService.moduleRef = moduleRef;
        this.model = model;
        this._conditions = conditions;
        this._pipeline = pipeline;
        this.collectionName = collectionName;
        this._entity = entity;
    }

    select(fields: Record<string, number>): this {
        this._pipeline.push({ $project: fields });
        return this;
    }

    skip(value: number): this {
        this._pipeline.push({ $skip: value });
        return this;
    }

    limit(value: number): this {
        this._pipeline.push({ $limit: value });
        return this;
    }

    sort(sort: Record<string, 1 | -1 | Expression.Meta>): this {
        this._pipeline.push({ $sort: sort });
        return this;
    }

    autoPopulate(autoPopulate: boolean): this {
        if (!autoPopulate) {
            this._pipeline = deleteAllLookup(this._pipeline);
        }
        return this;
    }

    @SGetCache()
    async exec(): Promise<T[]> {
        let pipeline: PipelineStage[] = [
            { $match: { deletedAt: null, ...this._conditions } },
        ];

        if (this._pipeline.length) {
            pipeline.push(...this._pipeline);
        }

        pipeline = sortPipelines(pipeline);

        return await this.model.aggregate(pipeline).exec();
    }
}
