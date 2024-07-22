import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { REDIS_FOLDER_NAME } from './constants';

@Injectable()
export class SuperCacheService {
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

    async setCollection(
        mainCollectionName: string,
        relationCollectionNames: any,
    ) {
        try {
            const collection = await this.getCollection(mainCollectionName);

            if (collection) {
                return;
            }

            await this.cacheManager.set(
                `${REDIS_FOLDER_NAME.COLLECTION}:${mainCollectionName}`,
                {
                    mainCollectionName,
                    relationCollectionNames,
                },
                60000 * 60 * 24 * 1,
            );
        } catch (error) {
            console.log('error', error);
        }
    }

    async getCollection(mainCollectionName: string) {
        try {
            const data = await this.cacheManager.get(
                `${REDIS_FOLDER_NAME.COLLECTION}:${mainCollectionName}`,
            );
            return data;
        } catch (error) {
            console.log('error', error);
        }
    }

    async setDataForCollection(
        mainCollectionName: string,
        key: string,
        data: any,
    ) {
        try {
            await this.set(`${mainCollectionName}:${key}`, data);
        } catch (error) {
            console.log('error', error);
        }
    }

    async getDataForCollection(mainCollectionName: string, key: string) {
        try {
            const data = await this.get(`${mainCollectionName}:${key}`);
            return data;
        } catch (error) {
            console.log('error', error);
        }
    }
}
