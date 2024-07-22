import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { appSettings } from 'src/configs/appsettings';

export class CacheModuleConfig extends CacheModule {
    static registerAsync() {
        if (appSettings.redis.heathCheck) {
            return CacheModule.registerAsync({
                isGlobal: true,
                useFactory: async () => ({
                    store: await redisStore({
                        socket: {
                            host: appSettings.redis.host,
                            port: appSettings.redis.port,
                        },
                        username: appSettings.redis.username,
                        password: appSettings.redis.password,
                    }),
                }),
            });
        }

        return CacheModule.register({ isGlobal: true });
    }
}
