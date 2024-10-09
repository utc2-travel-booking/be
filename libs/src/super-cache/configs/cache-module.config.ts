import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { SuperCacheModuleOptions } from '../super-cache.module';

export class CacheModuleConfig {
    static registerAsync(superCacheOptions: SuperCacheModuleOptions) {
        if (superCacheOptions.redis) {
            return CacheModule.registerAsync({
                isGlobal: true,
                useFactory: async () => ({
                    store: await redisStore({
                        socket: {
                            host: superCacheOptions.redis?.host,
                            port: superCacheOptions.redis?.port,
                        },
                        username: superCacheOptions.redis?.username,
                        password: superCacheOptions.redis?.password,
                    }),
                }),
            });
        }

        return CacheModule.register({ isGlobal: true });
    }
}
