import { Expression, Document, Model, PipelineStage } from 'mongoose';
import { ICustomQueryFindOne } from './interfaces/custom-query-find-one.interface';
import { ModuleRef } from '@nestjs/core';
import { COLLECTION_NAMES } from 'src/constants';
import { deleteAllLookup, sortPipelines } from 'src/packages/super-search';
import { SGetCache } from 'src/packages/super-cache';

export class CustomQueryFindOneService<T extends Document>
    implements ICustomQueryFindOne<T>
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
        this.id = CustomQueryFindOneService.name;
        CustomQueryFindOneService.moduleRef = moduleRef;
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
    async exec(): Promise<T | null> {
        let pipeline: PipelineStage[] = [
            { $match: { deletedAt: null, ...this._conditions } },
        ];

        if (this._pipeline.length) {
            pipeline.push(...this._pipeline);
        }

        pipeline = sortPipelines(pipeline);

        const result = await this.model.aggregate(pipeline).exec();
        return result.length ? result[0] : null;
    }
}
