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
var SuperCacheEvent_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperCacheEvent = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const super_cache_service_1 = require("../super-cache.service");
const constants_1 = require("../constants");
const constants_2 = require("../../../../src/constants");
let SuperCacheEvent = SuperCacheEvent_1 = class SuperCacheEvent {
    constructor(superCacheService) {
        this.superCacheService = superCacheService;
        this.logger = new common_1.Logger(SuperCacheEvent_1.name);
    }
    async handleDeleteCacheEvent(collectionName) {
        await this.superCacheService.deleteForDataCollection(collectionName);
    }
    async handleSetCacheEvent(collectionName, key, result) {
        await this.superCacheService.setDataForCollection(collectionName, key, result);
    }
};
__decorate([
    (0, event_emitter_1.OnEvent)(constants_1.SUPER_CACHE_EVENT_HANDLER.DELETE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SuperCacheEvent.prototype, "handleDeleteCacheEvent", null);
__decorate([
    (0, event_emitter_1.OnEvent)(constants_1.SUPER_CACHE_EVENT_HANDLER.SET),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SuperCacheEvent.prototype, "handleSetCacheEvent", null);
SuperCacheEvent = SuperCacheEvent_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [super_cache_service_1.SuperCacheService])
], SuperCacheEvent);
exports.SuperCacheEvent = SuperCacheEvent;
//# sourceMappingURL=super-cache.event.js.map