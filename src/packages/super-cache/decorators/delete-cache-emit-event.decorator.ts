import { COLLECTION_NAMES } from 'src/constants';
import { SUPER_CACHE_EVENT_HANDLER } from '../constants';
import { appSettings } from 'src/configs/appsettings';

export function DeleteCacheEmitEvent() {
    return (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) => {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const collectionName: COLLECTION_NAMES = this.collectionName;

            if (!collectionName) {
                throw new Error('Collection name must be provided');
            }

            if (appSettings.redis.heathCheck) {
                this.eventEmitter.emit(
                    SUPER_CACHE_EVENT_HANDLER.DELETE,
                    collectionName,
                );
            }

            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
