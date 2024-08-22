import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { Model } from 'mongoose';
import _ from 'lodash';
import { REDIS_FOLDER_NAME } from './constants';
import { SuperCacheService } from '@libs/super-cache/super-cache.service';
import { COLLECTION_NAMES } from 'src/constants';

@Injectable()
export class EntitiesService implements OnModuleInit {
    constructor(
        private readonly modulesContainer: ModulesContainer,
        private readonly superCacheService: SuperCacheService,
    ) {}

    async onModuleInit() {
        await this.getMongooseModels();
    }

    async getOne(collectionName: string) {
        const result = await this.superCacheService.get(
            `${REDIS_FOLDER_NAME.ENTITY}:${collectionName}`,
        );

        if (!result) {
            await this.getMongooseModels();
            await this.getOne(collectionName);
        }

        for (const [key, value] of Object.entries(result)) {
            if (value.ref) {
                const ref = await this.superCacheService.get(
                    `${REDIS_FOLDER_NAME.ENTITY}:${value.ref}`,
                );
                result[key].schema = ref;
            }
        }

        return result;
    }

    async getAll() {
        const keys = await this.superCacheService.getAllKeyInFolder(
            REDIS_FOLDER_NAME.ENTITY,
        );

        const result = [];
        for (const key of keys) {
            const schema = await this.superCacheService.get(key);
            result.push({ name: key.split(':')[1], schema });
        }

        return result;
    }

    private async getMongooseModels() {
        const modules = [...this.modulesContainer.values()];
        const models = [];

        for (const module of modules) {
            for (const [token, provider] of module.providers) {
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
            const _schema: any[] = [];

            for (const [key, value] of Object.entries(schema.obj)) {
                const ref = _.get(value, 'ref', null);

                let type = _.get(value, 'type', null);
                if (ref && ref === COLLECTION_NAMES.FILE) {
                    type = 'File';
                } else if (ref) {
                    type = 'Relation';
                }

                _schema.push({
                    key,
                    type,
                    ref,
                    default: _.get(value, 'default', null),
                    required: _.get(value, 'required', false),
                    enum: _.get(value, 'enum', null),
                    schema: null,
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

            await this.superCacheService.set(
                `${REDIS_FOLDER_NAME.ENTITY}:${name}`,
                schemaObject,
            );
        }
    }
}
