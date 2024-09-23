import { Model, PipelineStage, Document } from 'mongoose';
import { ModuleRef } from '@nestjs/core';
import { COLLECTION_NAMES } from 'src/constants';

export class CustomQueryBaseService<T extends Document> {
    protected id: string;
    protected collectionName: COLLECTION_NAMES;
    protected model: Model<T>;
    protected _conditions: Record<string, any> = {};
    protected _pipeline: PipelineStage[] = [];
    public static moduleRef: ModuleRef;
    protected _entity: new () => any;

    constructor(
        model: Model<T>,
        entity: new () => any,
        collectionName: COLLECTION_NAMES,
        moduleRef: ModuleRef,
        conditions: Record<string, any> = {},
        pipeline: PipelineStage[] = [],
    ) {
        this.id = CustomQueryBaseService.name;
        CustomQueryBaseService.moduleRef = moduleRef;
        this.model = model;
        this._conditions = conditions;
        this._pipeline = pipeline;
        this.collectionName = collectionName;
        this._entity = entity;
    }
}
