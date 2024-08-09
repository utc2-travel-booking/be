import { ModuleRef } from '@nestjs/core';
import { Model, PipelineStage, Document, Expression } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { SGetCache } from '../../super-cache';
import { ICustomQueryCountDocuments } from './interfaces/custom-query-count-documents.interface';
import _ from 'lodash';
import { sortPipelines } from 'src/packages/super-search';

export class CustomQueryCountDocumentsService<T extends Document>
    implements ICustomQueryCountDocuments<T>
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
        this.id = CustomQueryCountDocumentsService.name;
        CustomQueryCountDocumentsService.moduleRef = moduleRef;
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

    @SGetCache()
    async exec(): Promise<number> {
        let pipeline: PipelineStage[] = [
            { $match: { deletedAt: null, ...this._conditions } },
        ];

        if (this._pipeline.length) {
            pipeline.push(...this._pipeline);
        }

        pipeline.push({ $count: 'totalCount' });

        pipeline = sortPipelines(pipeline);

        const result = await this.model.aggregate(pipeline).exec();
        return _.get(result, '[0].totalCount', 0);
    }
}
