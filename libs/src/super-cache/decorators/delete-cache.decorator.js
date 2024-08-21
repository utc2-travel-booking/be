"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteCache = void 0;
const constants_1 = require("../../../../src/constants");
const event_emitter_1 = require("@nestjs/event-emitter");
const create_redis_folder_collection_utils_1 = require("../common/create-redis-folder-collection.utils");
const super_cache_service_1 = require("../super-cache.service");
function DeleteCache() {
    let superCacheService;
    let eventEmitter;
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            if (this.collectionName === constants_1.COLLECTION_NAMES.AUDIT) {
                return originalMethod.apply(this, args);
            }
            if (!superCacheService || !eventEmitter) {
                const moduleRef = this.constructor
                    .moduleRef;
                if (moduleRef) {
                    superCacheService = moduleRef.get(super_cache_service_1.SuperCacheService, {
                        strict: false,
                    });
                    eventEmitter = moduleRef.get(event_emitter_1.EventEmitter2, {
                        strict: false,
                    });
                }
                else {
                    throw new Error('ModuleRef is not available. Ensure your class is registered in the module.');
                }
            }
            const collectionName = this.collectionName;
            await (0, create_redis_folder_collection_utils_1.createRedisFolderCollection)(this.collectionName, this._entity, superCacheService);
            if (!collectionName) {
                throw new Error('Collection name must be provided');
            }
            await superCacheService.deleteForDataCollection(collectionName);
            await (0, create_redis_folder_collection_utils_1.createRedisFolderCollection)(this.collectionName, this._entity, superCacheService);
            return originalMethod.apply(this, args);
        };
        return descriptor;
    };
}
exports.DeleteCache = DeleteCache;
//# sourceMappingURL=delete-cache.decorator.js.map