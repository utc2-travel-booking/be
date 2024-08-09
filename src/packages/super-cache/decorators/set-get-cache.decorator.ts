import { SuperCacheService } from '../super-cache.service';
import { ModuleRef } from '@nestjs/core';
import { generateKey } from '../common/genarate-key.utils';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SUPER_CACHE_EVENT_HANDLER } from '../constants';
import _ from 'lodash';
import { RequestContext } from 'src/packages/super-request-context';
import { appSettings } from 'src/configs/appsettings';
import { createRedisFolderCollection } from '../common/create-redis-folder-collection.utils';
import { COLLECTION_NAMES } from 'src/constants';

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
            if (this.collectionName === COLLECTION_NAMES.AUDIT) {
                return originalMethod.apply(this, args);
            }

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

            const key = generateKey({
                _pipeline: this._pipeline,
                _conditions: this._conditions,
                id: this.id,
                collectionName: this.collectionName,
                locale,
            });

            await createRedisFolderCollection(
                this.collectionName,
                this._entity,
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
                } else {
                    return cacheData;
                }
            }

            const result = await originalMethod.apply(this, args);

            eventEmitter.emit(
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
