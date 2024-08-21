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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomQueryFindOneService = void 0;
const super_search_1 = require("../../super-search");
const super_cache_1 = require("../../super-cache");
class CustomQueryFindOneService {
    constructor(model, entity, collectionName, moduleRef, conditions = {}, pipeline = []) {
        this._conditions = {};
        this._pipeline = [];
        this.id = CustomQueryFindOneService.name;
        CustomQueryFindOneService.moduleRef = moduleRef;
        this.model = model;
        this._conditions = conditions;
        this._pipeline = pipeline;
        this.collectionName = collectionName;
        this._entity = entity;
    }
    select(fields) {
        this._pipeline.push({ $project: fields });
        return this;
    }
    sort(sort) {
        this._pipeline.push({ $sort: sort });
        return this;
    }
    autoPopulate(autoPopulate) {
        if (!autoPopulate) {
            this._pipeline = (0, super_search_1.deleteAllLookup)(this._pipeline);
        }
        return this;
    }
    async exec() {
        let pipeline = [
            { $match: Object.assign({ deletedAt: null }, this._conditions) },
        ];
        if (this._pipeline.length) {
            pipeline.push(...this._pipeline);
        }
        pipeline = (0, super_search_1.sortPipelines)(pipeline);
        const result = await this.model.aggregate(pipeline).exec();
        return result.length ? result[0] : null;
    }
}
__decorate([
    (0, super_cache_1.SGetCache)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomQueryFindOneService.prototype, "exec", null);
exports.CustomQueryFindOneService = CustomQueryFindOneService;
//# sourceMappingURL=custom-query-find-one.service.js.map