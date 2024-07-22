import { CacheModule } from '@nestjs/cache-manager';
import { SuperCacheService } from './super-cache.service';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import { appSettings } from 'src/configs/appsettings';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SuperCacheInterceptor } from './interceptors/super-cache.interceptor';

@Module({
    imports: [
        CacheModule.registerAsync({
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
        }),
    ],
    controllers: [],
    providers: [
        SuperCacheService,
        {
            provide: APP_INTERCEPTOR,
            useClass: SuperCacheInterceptor,
        },
    ],
    exports: [SuperCacheService],
})
export class SuperCacheModule {}
