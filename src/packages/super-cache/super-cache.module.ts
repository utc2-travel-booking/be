import { SuperCacheService } from './super-cache.service';
import { Module } from '@nestjs/common';
import { SuperCacheEvent } from './event-handlers/super-cache.event';
import { CacheModuleConfig } from './configs/cache-module.config';
import { SuperCacheController } from './super-cache.controller';

@Module({
    imports: [CacheModuleConfig.registerAsync()],
    controllers: [SuperCacheController],
    providers: [SuperCacheService, SuperCacheEvent],
    exports: [SuperCacheService],
})
export class SuperCacheModule {}
