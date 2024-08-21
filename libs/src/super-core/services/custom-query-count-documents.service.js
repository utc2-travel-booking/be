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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomQueryCountDocumentsService = void 0;
const super_cache_1 = require("../../super-cache");
const lodash_1 = __importDefault(require("lodash"));
const super_search_1 = require("../../super-search");
class CustomQueryCountDocumentsService {
    constructor(model, entity, collectionName, moduleRef, conditions = {}, pipeline = []) {
        this._conditions = {};
        this._pipeline = [];
        this.id = CustomQueryCountDocumentsService.name;
        CustomQueryCountDocumentsService.moduleRef = moduleRef;
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
    skip(value) {
        this._pipeline.push({ $skip: value });
        return this;
    }
    limit(value) {
        this._pipeline.push({ $limit: value });
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
        pipeline.push({ $count: 'totalCount' });
        pipeline = (0, super_search_1.sortPipelines)(pipeline);
        const result = await this.model.aggregate(pipeline).exec();
        return lodash_1.default.get(result, '[0].totalCount', 0);
    }
}
__decorate([
    (0, super_cache_1.SGetCache)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CustomQueryCountDocumentsService.prototype, "exec", null);
exports.CustomQueryCountDocumentsService = CustomQueryCountDocumentsService;
//# sourceMappingURL=custom-query-count-documents.service.js.map