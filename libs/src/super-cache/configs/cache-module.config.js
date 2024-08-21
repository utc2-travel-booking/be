"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheModuleConfig = void 0;
const cache_manager_1 = require("@nestjs/cache-manager");
const cache_manager_redis_yet_1 = require("cache-manager-redis-yet");
const appsettings_1 = require("../../../../src/configs/appsettings");
class CacheModuleConfig extends cache_manager_1.CacheModule {
    static registerAsync() {
        if (appsettings_1.appSettings.redis.heathCheck) {
            return cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                useFactory: async () => ({
                    store: await (0, cache_manager_redis_yet_1.redisStore)({
                        socket: {
                            host: appsettings_1.appSettings.redis.host,
                            port: appsettings_1.appSettings.redis.port,
                        },
                        username: appsettings_1.appSettings.redis.username,
                        password: appsettings_1.appSettings.redis.password,
                    }),
                }),
            });
        }
        return cache_manager_1.CacheModule.register({ isGlobal: true });
    }
}
exports.CacheModuleConfig = CacheModuleConfig;
//# sourceMappingURL=cache-module.config.js.map