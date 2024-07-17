import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheManagerService {
    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {}

    async get(key: string) {
        try {
            const data = await this.cacheManager.get(key);
            return data;
        } catch (error) {
            console.log('error', error);
        }
    }

    async set(key: string, data: any) {
        try {
            await this.cacheManager.set(key, data, 60000 * 60 * 24 * 1);
        } catch (error) {
            console.log('error', error);
        }
    }
}
