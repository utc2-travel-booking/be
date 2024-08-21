"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SuperCacheModule = void 0;
const super_cache_service_1 = require("./super-cache.service");
const common_1 = require("@nestjs/common");
const super_cache_event_1 = require("./event-handlers/super-cache.event");
const cache_module_config_1 = require("./configs/cache-module.config");
const super_cache_controller_1 = require("./super-cache.controller");
let SuperCacheModule = class SuperCacheModule {
};
SuperCacheModule = __decorate([
    (0, common_1.Module)({
        imports: [cache_module_config_1.CacheModuleConfig.registerAsync()],
        controllers: [super_cache_controller_1.SuperCacheController],
        providers: [super_cache_service_1.SuperCacheService, super_cache_event_1.SuperCacheEvent],
        exports: [super_cache_service_1.SuperCacheService],
    })
], SuperCacheModule);
exports.SuperCacheModule = SuperCacheModule;
//# sourceMappingURL=super-cache.module.js.map