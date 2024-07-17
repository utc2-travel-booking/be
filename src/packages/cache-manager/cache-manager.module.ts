import { CacheModule } from '@nestjs/cache-manager';
import { CacheManagerService } from './cache-manager.service';
import { Module } from '@nestjs/common';

@Module({
    imports: [CacheModule.register({ isGlobal: true })],
    controllers: [],
    providers: [CacheManagerService],
    exports: [CacheManagerService],
})
export class CacheManagerModule {}
