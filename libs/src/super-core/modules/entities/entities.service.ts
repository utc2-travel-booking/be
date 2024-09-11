import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { Model } from 'mongoose';
import _, { isBoolean } from 'lodash';
import { COLLECTION_NAMES } from 'src/constants';
import { Entity, Schema } from '@libs/super-core/metadata/entity.interface';
import { isDate, isNumber, isString } from '@libs/super-core';

@Injectable()
export class EntitiesService implements OnModuleInit {
    private entities = new Array<Entity>();
    constructor(private readonly modulesContainer: ModulesContainer) {}

    async onModuleInit() {
        await this.getMongooseModels();
    }

    async getOne(collectionName: string) {
        return this.entities.find((entity) => entity.name === collectionName);
    }

    async getAll() {
        return this.entities;
    }

    private async getMongooseModels() {
        const modules = [...this.modulesContainer.values()];
        const models = [];

        for (const module of modules) {
            for (const [, provider] of module.providers) {
                if (
                    provider.instance &&
                    (provider.instance as Model<any>).modelName
                ) {
                    const model = provider.instance as Model<any>;
                    models.push({
                        name: model.modelName,
                        schema: model.schema,
                        class: model.constructor,
                    });
                }
            }
        }

        const result = await this.processModels(models);
        return result;
    }

    private async processModels(models: any[]) {
        for (const model of models) {
            const { name, schema } = model;
            const _schema: Schema[] = [];

            for (const [key, value] of Object.entries(schema.obj)) {
                const ref = _.get(value, 'ref', null);
                let type = _.get(value, 'type', null);

                switch (true) {
                    case isString(type):
                        type = 'String';
                        break;
                    case isNumber(type):
                        type = 'Number';
                        break;
                    case isDate(type):
                        type = 'Date';
                        break;
                    case isBoolean(type):
                        type = 'Boolean';
                        break;
                    case !!ref && ref === COLLECTION_NAMES.FILE:
                        type = 'File';
                        break;
                    case !!ref:
                        type = 'Relation';
                        break;
                    default:
                        type = 'String';
                }

                _schema.push({
                    key,
                    type,
                    ref,
                    default: _.get(value, 'default', null),
                    required: _.get(value, 'required', false),
                    enum: _.get(value, 'enum', null),
                    entity: null,
                    label: _.get(value, 'cms.label', key),
                    isTableShow: _.get(value, 'cms.tableShow', false),
                    index: _.get(value, 'cms.index', false),
                    columnPosition: _.get(value, 'cms.columnPosition', 0),
                });
            }

            _schema.sort((a, b) => a.columnPosition - b.columnPosition);

            const schemaObject = _schema.reduce((acc, curr) => {
                acc[curr.key] = curr;
                return acc;
            }, {});

            this.entities.push({ name, schema: schemaObject });
        }
    }
}
