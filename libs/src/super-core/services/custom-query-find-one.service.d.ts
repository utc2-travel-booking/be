import { Expression, Document, Model, PipelineStage } from 'mongoose';
import { ICustomQueryFindOne } from './interfaces/custom-query-find-one.interface';
import { ModuleRef } from '@nestjs/core';
import { COLLECTION_NAMES } from 'src/constants';
export declare class CustomQueryFindOneService<T extends Document> implements ICustomQueryFindOne<T> {
    private id;
    private collectionName;
    private model;
    private _conditions;
    private _pipeline;
    static moduleRef: ModuleRef;
    private _entity;
    constructor(model: Model<T>, entity: new () => any, collectionName: COLLECTION_NAMES, moduleRef: ModuleRef, conditions?: Record<string, any>, pipeline?: PipelineStage[]);
    select(fields: Record<string, number>): this;
    sort(sort: Record<string, 1 | -1 | Expression.Meta>): this;
    autoPopulate(autoPopulate: boolean): this;
    exec(): Promise<T | null>;
}
