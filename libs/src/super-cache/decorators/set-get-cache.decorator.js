"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SGetCache = void 0;
const super_cache_service_1 = require("../super-cache.service");
const genarate_key_utils_1 = require("../common/genarate-key.utils");
const event_emitter_1 = require("@nestjs/event-emitter");
const constants_1 = require("../constants");
const lodash_1 = __importDefault(require("lodash"));
const super_request_context_1 = require("../../super-request-context");
const appsettings_1 = require("../../../../src/configs/appsettings");
const create_redis_folder_collection_utils_1 = require("../common/create-redis-folder-collection.utils");
const constants_2 = require("../../../../src/constants");
function SGetCache() {
    let superCacheService;
    let eventEmitter;
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            if (this.collectionName === constants_2.COLLECTION_NAMES.AUDIT) {
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
            const req = lodash_1.default.get(super_request_context_1.RequestContext, 'currentContext.req', null);
            const query = lodash_1.default.get(req, 'query', {});
            const locale = lodash_1.default.get(query, 'locale', appsettings_1.appSettings.mainLanguage);
            const key = (0, genarate_key_utils_1.generateKey)({
                _pipeline: this._pipeline,
                _conditions: this._conditions,
                id: this.id,
                collectionName: this.collectionName,
                locale,
                query,
            });
            await (0, create_redis_folder_collection_utils_1.createRedisFolderCollection)(this.collectionName, this._entity, superCacheService);
            const cacheData = await superCacheService.getDataForCollection(this.collectionName, key);
            if (cacheData) {
                if (Array.isArray(cacheData)) {
                    return cacheData.map((item) => lodash_1.default.set(item, 'cached', true));
                }
                else if (cacheData && typeof cacheData === 'object') {
                    return lodash_1.default.set(cacheData, 'cached', true);
                }
                else {
                    return cacheData;
                }
            }
            const result = await originalMethod.apply(this, args);
            if (result) {
                eventEmitter.emit(constants_1.SUPER_CACHE_EVENT_HANDLER.SET, this.collectionName, key, result);
            }
            return result;
        };
        return descriptor;
    };
}
exports.SGetCache = SGetCache;
//# sourceMappingURL=set-get-cache.decorator.js.map