import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { REDIS_FOLDER_NAME } from './constants';
import { CollectionModel } from './models/collections.model';

@Injectable()
export class SuperCacheService implements OnModuleInit {
    private readonly logger = new Logger(SuperCacheService.name);
    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache,
    ) {}

    async onModuleInit() {
        await this.resetCache();
    }

    async get<T>(key: string) {
        try {
            const data = await this.cacheManager.get<T>(key);
            return data;
        } catch (error) {
            this.logger.error('error get', JSON.stringify(error));
        }
    }

    async set(key: string, data: any, ttl = 1) {
        try {
            await this.cacheManager
                .set(key, data, ttl * 24 * 60 * 60 * 6000)
                .catch((e) => {
                    this.logger.error(e);
                });
        } catch (error) {
            this.logger.error('error set', JSON.stringify(error));
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
            this.logger.error('error setOneCollection', JSON.stringify(error));
        }
    }

    async getOneCollection(mainCollectionName: string) {
        try {
            const data = await this.cacheManager.get(
                `${REDIS_FOLDER_NAME.COLLECTION}:${mainCollectionName}`,
            );
            return data;
        } catch (error) {
            this.logger.error('error getOneCollection', JSON.stringify(error));
        }
    }

    async deleteForDataCollection(mainCollectionName: string) {
        try {
            const collections = await this.getAllCollection();

            if (!collections || !collections?.length) {
                return;
            }

            const keys: string[] = await this.cacheManager.store.keys(
                `${mainCollectionName}:*`,
            );

            if (!keys.length) {
                return;
            }

            await Promise.all(keys.map((key) => this.cacheManager.del(key)));

            const relationCollectionNames = collections.filter((collection) =>
                collection?.relationCollectionNames?.includes(
                    mainCollectionName,
                ),
            );

            await this.deleteForDataCollectionRelation(relationCollectionNames);
        } catch (error) {
            this.logger.error(
                'error deleteForDataCollection',
                JSON.stringify(error),
            );
            await this.resetCache();
        }
    }

    private async deleteForDataCollectionRelation(
        collectionRelations: CollectionModel[],
    ) {
        try {
            if (!collectionRelations || !collectionRelations?.length) {
                return;
            }

            for (const collection of collectionRelations) {
                const keys: string[] = await this.cacheManager.store.keys(
                    `${collection.mainCollectionName}:*`,
                );

                if (!keys.length) {
                    return;
                }

                await Promise.all(
                    keys.map((key) => this.cacheManager.del(key)),
                );
            }
        } catch (error) {
            this.logger.error(
                'error deleteForDataCollectionRelation',
                JSON.stringify(error),
            );
            await this.resetCache();
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
            this.logger.error(
                'error setDataForCollection',
                JSON.stringify(error),
            );
        }
    }

    async getDataForCollection(mainCollectionName: string, key: string) {
        try {
            const data = await this.get(`${mainCollectionName}:${key}`);
            return data;
        } catch (error) {
            this.logger.error(
                'error getDataForCollection',
                JSON.stringify(error),
            );
        }
    }

    async resetCache() {
        await this.cacheManager.reset();
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
            this.logger.error('error getAllCollection', JSON.stringify(error));
        }
    }
}
