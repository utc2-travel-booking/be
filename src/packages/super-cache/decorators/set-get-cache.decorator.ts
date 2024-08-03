import { SuperCacheService } from '../super-cache.service';
import { ModuleRef } from '@nestjs/core';
import { FindMongooseModel } from 'src/base/models/find-mongoose.model';
import { generateKey } from '../common/genarate-key.utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SUPER_CACHE_EVENT_HANDLER } from '../constants';
import _ from 'lodash';
import { RequestContext } from 'src/packages/super-request-context';
import { appSettings } from 'src/configs/appsettings';
import { TypeMetadataStorage } from '@nestjs/mongoose/dist/storages/type-metadata.storage';

export function SGetCache() {
    let superCacheService: SuperCacheService;
    let eventEmitter: EventEmitter2;

    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            if (!superCacheService || !eventEmitter) {
                const moduleRef = (this.constructor as any)
                    .moduleRef as ModuleRef;
                if (moduleRef) {
                    superCacheService = moduleRef.get(SuperCacheService, {
                        strict: false,
                    });
                    eventEmitter = moduleRef.get(EventEmitter2, {
                        strict: false,
                    });
                } else {
                    throw new Error(
                        'ModuleRef is not available. Ensure your class is registered in the module.',
                    );
                }
            }

            const req: Request = _.get(
                RequestContext,
                'currentContext.req',
                null,
            );

            const query = _.get(req, 'query', {});
            const locale = _.get(query, 'locale', appSettings.mainLanguage);

            const [option] = args;
            const { filterPipeline, filter, projection, options } =
                option as FindMongooseModel<any>;

            const key = generateKey({
                ...filterPipeline,
                ...filter,
                projection,
                ...options,
                locale,
            });

            await createRedisFolderCollection(
                this.collectionName,
                this.entity,
                superCacheService,
            );

            const cacheData = await superCacheService.getDataForCollection(
                this.collectionName,
                key,
            );

            if (cacheData) {
                if (Array.isArray(cacheData)) {
                    return cacheData.map((item) => _.set(item, 'cached', true));
                } else if (cacheData && typeof cacheData === 'object') {
                    return _.set(cacheData, 'cached', true);
                }
            }

            const result = await originalMethod.apply(this, args);

            this.eventEmitter.emit(
                SUPER_CACHE_EVENT_HANDLER.SET,
                this.collectionName,
                key,
                result,
            );

            return result;
        };

        return descriptor;
    };
}

const createRedisFolderCollection = async (
    collectionName: string,
    entity: any,
    superCacheService: SuperCacheService,
) => {
    const schemaMetadata =
        TypeMetadataStorage.getSchemaMetadataByTarget(entity);

    if (!schemaMetadata) return;

    const relationCollectionNames = [];
    schemaMetadata.properties.forEach((property) => {
        if (property.options['ref']) {
            relationCollectionNames.push(property.options['ref']);
        }
    });

    await superCacheService.setOneCollection(
        collectionName,
        relationCollectionNames,
    );
};
