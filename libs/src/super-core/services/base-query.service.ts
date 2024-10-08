import { Model, PipelineStage, Document } from 'mongoose';
import { ModuleRef } from '@nestjs/core';

export class CustomQueryBaseService<T extends Document> {
    protected id: string;
    protected collectionName: string;
    protected model: Model<T>;
    protected _conditions: Record<string, any> = {};
    protected _pipeline: PipelineStage[] = [];
    public static moduleRef: ModuleRef;
    protected _entity: new () => any;

    constructor(
        model: Model<T>,
        entity: new () => any,
        collectionName: string,
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
