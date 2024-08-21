import { ModuleRef } from '@nestjs/core';
import { Model, PipelineStage, Document, Expression } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { ICustomQueryFindAll } from './interfaces/custom-query-find-all.interface';
export declare class CustomQueryFindAllService<T extends Document> implements ICustomQueryFindAll<T> {
    private id;
    private collectionName;
    private model;
    private _conditions;
    private _pipeline;
    static moduleRef: ModuleRef;
    private _entity;
    constructor(model: Model<T>, entity: new () => any, collectionName: COLLECTION_NAMES, moduleRef: ModuleRef, conditions?: Record<string, any>, pipeline?: PipelineStage[]);
    select(fields: Record<string, number>): this;
    skip(value: number): this;
    limit(value: number): this;
    sort(sort: Record<string, 1 | -1 | Expression.Meta>): this;
    autoPopulate(autoPopulate: boolean): this;
    exec(): Promise<T[]>;
}
