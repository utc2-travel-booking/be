"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SuperCacheService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperCacheService = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const common_1 = require("@nestjs/common");
const constants_1 = require("./constants");
let SuperCacheService = SuperCacheService_1 = class SuperCacheService {
    constructor(cacheManager) {
        this.cacheManager = cacheManager;
        this.logger = new common_1.Logger(SuperCacheService_1.name);
    }
    async onModuleInit() {
        return await this.resetCache();
    }
    async get(key) {
        return await this.cacheManager.get(key);
    }
    async set(key, data, ttl = 1) {
        return await this.cacheManager
            .set(key, data, ttl * 24 * 60 * 60 * 6000)
            .catch((e) => {
            this.logger.error(e);
        });
    }
    async setOneCollection(mainCollectionName, relationCollectionNames) {
        const collection = await this.getOneCollection(mainCollectionName);
        if (collection) {
            return;
        }
        return await this.cacheManager.set(`${constants_1.REDIS_FOLDER_NAME.COLLECTION}:${mainCollectionName}`, {
            mainCollectionName,
            relationCollectionNames,
        });
    }
    async getOneCollection(mainCollectionName) {
        const data = await this.cacheManager.get(`${constants_1.REDIS_FOLDER_NAME.COLLECTION}:${mainCollectionName}`);
        return data;
    }
    async deleteForDataCollection(mainCollectionName) {
        const collections = await this.getAllCollection();
        if (!collections || !(collections === null || collections === void 0 ? void 0 : collections.length)) {
            return;
        }
        const keys = await this.cacheManager.store.keys(`${mainCollectionName}:*`);
        if (!keys.length) {
            return;
        }
        await Promise.all(keys.map((key) => this.cacheManager.del(key)));
        const relationCollectionNames = collections.filter((collection) => { var _a; return (_a = collection === null || collection === void 0 ? void 0 : collection.relationCollectionNames) === null || _a === void 0 ? void 0 : _a.includes(mainCollectionName); });
        await this.deleteForDataCollectionRelation(relationCollectionNames);
    }
    async setDataForCollection(mainCollectionName, key, data) {
        await this.set(`${mainCollectionName}:${key}`, data);
    }
    async deleteForDataCollectionRelation(collectionRelations) {
        if (!collectionRelations || !(collectionRelations === null || collectionRelations === void 0 ? void 0 : collectionRelations.length)) {
            return;
        }
        for (const collection of collectionRelations) {
            const keys = await this.cacheManager.store.keys(`${collection.mainCollectionName}:*`);
            if (!keys.length) {
                return;
            }
            await Promise.all(keys.map((key) => this.cacheManager.del(key)));
        }
    }
    async getDataForCollection(mainCollectionName, key) {
        const data = await this.get(`${mainCollectionName}:${key}`);
        return data;
    }
    async resetCache() {
        await this.cacheManager.reset();
    }
    async getAllCollection() {
        const keys = await this.cacheManager.store.keys(`${constants_1.REDIS_FOLDER_NAME.COLLECTION}:*`);
        if (!keys.length) {
            return null;
        }
        const data = await Promise.all(keys.map((key) => this.cacheManager.get(key)));
        return data;
    }
};
SuperCacheService = SuperCacheService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [Object])
], SuperCacheService);
exports.SuperCacheService = SuperCacheService;
//# sourceMappingURL=super-cache.service.js.map