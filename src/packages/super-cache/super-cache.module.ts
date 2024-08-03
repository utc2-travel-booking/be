import { SuperCacheService } from './super-cache.service';
import { Module } from '@nestjs/common';
import { SuperCacheEvent } from './event-handlers/super-cache.event';
import { CacheModuleConfig } from './configs/cache-module.config';

@Module({
    imports: [CacheModuleConfig.registerAsync()],
    controllers: [],
    providers: [SuperCacheService, SuperCacheEvent],
    exports: [SuperCacheService],
})
export class SuperCacheModule {}
