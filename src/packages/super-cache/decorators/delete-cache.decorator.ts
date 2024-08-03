import { COLLECTION_NAMES } from 'src/constants';
import { SUPER_CACHE_EVENT_HANDLER } from '../constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ModuleRef } from '@nestjs/core';
import { createRedisFolderCollection } from '../common/create-redis-folder-collection.utils';
import { SuperCacheService } from '../super-cache.service';

export function DeleteCache() {
    let superCacheService: SuperCacheService;
    let eventEmitter: EventEmitter2;
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) => {
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

            const collectionName: COLLECTION_NAMES = this.collectionName;

            await createRedisFolderCollection(
                this.collectionName,
                this.entity,
                superCacheService,
            );

            if (!collectionName) {
                throw new Error('Collection name must be provided');
            }

            eventEmitter.emit(SUPER_CACHE_EVENT_HANDLER.DELETE, collectionName);

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
