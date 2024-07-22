import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { REDIS_FOLDER_NAME } from './constants';

@Injectable()
export class SuperCacheService {
    private readonly logger = new Logger(SuperCacheService.name);
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
            this.logger.debug('error', error);
        }
    }

    async setOneCollection(
        mainCollectionName: string,
        relationCollectionNames: any,
    ) {
        try {
            const collection = await this.getOneCollection(mainCollectionName);

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
            this.logger.debug('error', error);
        }
    }

    async getOneCollection(mainCollectionName: string) {
        try {
            const data = await this.cacheManager.get(
                `${REDIS_FOLDER_NAME.COLLECTION}:${mainCollectionName}`,
            );
            return data;
        } catch (error) {
            this.logger.debug('error', error);
        }
    }

    async deleteForDataCollection(mainCollectionName: string) {
        try {
            const collections = await this.getAllCollection();

            console.log('collections', collections);
        } catch (error) {
            this.logger.debug('error', error);
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
            this.logger.debug('error', error);
        } finally {
            await this.setForDataCollectionKey(mainCollectionName, key);
        }
    }

    async getDataForCollection(mainCollectionName: string, key: string) {
        try {
            const data = await this.get(`${mainCollectionName}:${key}`);
            return data;
        } catch (error) {
            this.logger.debug('error', error);
        }
    }

    private async setForDataCollectionKey(
        mainCollectionName: string,
        key: string,
    ) {
        try {
            const folderKeys = `${REDIS_FOLDER_NAME.COLLECTION_KEYS}:${mainCollectionName}`;
            const cacheKeys = await this.cacheManager.get<any>(folderKeys);

            if (cacheKeys) {
                cacheKeys.addedKeys.push(key);
                await this.set(folderKeys, cacheKeys);

                return;
            }

            const newCacheKeys = new Set<string>();
            newCacheKeys.add(key);

            await this.set(folderKeys, {
                addedKeys: Array.from(newCacheKeys),
            });
        } catch (error) {
            this.logger.debug('error', error);
        }
    }

    private async getAllCollection() {
        try {
            const keys = await this.cacheManager.store.keys(
                `${REDIS_FOLDER_NAME.COLLECTION}:*`,
            );

            if (!keys.length) {
                return [];
            }

            const data = await Promise.all(
                keys.map((key) => this.cacheManager.get(key)),
            );

            return data;
        } catch (error) {
            this.logger.debug('error', error);
        }
    }
}
