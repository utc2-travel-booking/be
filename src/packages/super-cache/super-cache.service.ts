import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { REDIS_FOLDER_NAME } from './constants';
import { CollectionModel } from './models/collections.model';
import { CollectionKey } from './models/collection-keys.model';

@Injectable()
export class SuperCacheService {
    private readonly logger = new Logger(SuperCacheService.name);
    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {}

    async get<T>(key: string) {
        try {
            const data = await this.cacheManager.get<T>(key);
            return data;
        } catch (error) {
            console.log('error get', error);
        }
    }

    async set(key: string, data: any, ttl = 1) {
        try {
            await this.cacheManager
                .set(key, data, ttl * 24 * 60 * 60 * 6000)
                .catch((e) => {
                    console.log(e);
                });
        } catch (error) {
            this.logger.error('error set', error);
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
            );
        } catch (error) {
            this.logger.error('error setOneCollection', error);
        }
    }

    async getOneCollection(mainCollectionName: string) {
        try {
            const data = await this.cacheManager.get(
                `${REDIS_FOLDER_NAME.COLLECTION}:${mainCollectionName}`,
            );
            return data;
        } catch (error) {
            this.logger.error('error getOneCollection', error);
        }
    }

    async deleteForDataCollection(mainCollectionName: string) {
        try {
            const collections = await this.getAllCollection();

            if (!collections.length) {
                return;
            }

            const parentCollections = collections.filter((collection) =>
                collection.relationCollectionNames.includes(mainCollectionName),
            );
            const mainCollection = collections.find(
                (collection) =>
                    collection.mainCollectionName === mainCollectionName,
            );

            if (!mainCollection) {
                return;
            }

            const _collections = [...parentCollections, ...[mainCollection]];

            const data = await Promise.all(
                _collections.map(async (collection) => {
                    return {
                        mainCollectionName: collection.mainCollectionName,
                        keys: await this.getForDataCollectionKey(
                            collection.mainCollectionName,
                        ),
                    };
                }),
            );

            console.log(data);

            for (const { mainCollectionName, keys } of data) {
                await this.deleteDataForCollections(mainCollectionName, keys);
                await this.deleteForDataCollectionKey(mainCollectionName);
            }
        } catch (error) {
            this.logger.error('error deleteForDataCollection', error);
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
            this.logger.error('error setDataForCollection', error);
        } finally {
            await this.setForDataCollectionKey(mainCollectionName, key);
        }
    }

    async getDataForCollection(mainCollectionName: string, key: string) {
        try {
            const data = await this.get(`${mainCollectionName}:${key}`);
            return data;
        } catch (error) {
            this.logger.error('error getDataForCollection', error);
        }
    }

    private async deleteDataForCollections(
        mainCollectionName: string,
        key: string[],
    ) {
        try {
            await Promise.all(
                key.map(async (k) => {
                    await this.cacheManager.del(`${mainCollectionName}:${k}`);
                }),
            );
        } catch (error) {
            this.logger.error('error deleteDataForCollections', error);
        }
    }

    private async setForDataCollectionKey(
        mainCollectionName: string,
        key: string,
    ) {
        try {
            const folderKeys = `${REDIS_FOLDER_NAME.COLLECTION_KEYS}:${mainCollectionName}`;
            const cacheKeys = await this.cacheManager.get<CollectionKey>(
                folderKeys,
            );

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
            this.logger.error('error setForDataCollectionKey', error);
        }
    }

    private async getForDataCollectionKey(
        mainCollectionName: string,
    ): Promise<string[]> {
        try {
            const folderKeys = `${REDIS_FOLDER_NAME.COLLECTION_KEYS}:${mainCollectionName}`;
            const cacheKeys = await this.cacheManager.get<CollectionKey>(
                folderKeys,
            );

            const { addedKeys } = cacheKeys || { addedKeys: [] };
            return addedKeys;
        } catch (error) {
            this.logger.error('error', error);
        }
    }

    private async deleteForDataCollectionKey(mainCollectionName: string) {
        try {
            await this.cacheManager.del(
                `${REDIS_FOLDER_NAME.COLLECTION_KEYS}:${mainCollectionName}`,
            );
        } catch (error) {
            this.logger.error('error getForDataCollectionKey', error);
        }
    }

    private async getAllCollection(): Promise<CollectionModel[]> {
        try {
            const keys = await this.cacheManager.store.keys(
                `${REDIS_FOLDER_NAME.COLLECTION}:*`,
            );

            if (!keys.length) {
                return null;
            }

            const data: CollectionModel[] = await Promise.all(
                keys.map((key) => this.cacheManager.get<CollectionModel>(key)),
            );

            return data;
        } catch (error) {
            this.logger.error('error getAllCollection', error);
        }
    }
}
