import { OnModuleInit } from '@nestjs/common';
import { Cache } from 'cache-manager';
export declare class SuperCacheService implements OnModuleInit {
    private cacheManager;
    private readonly logger;
    constructor(cacheManager: Cache);
    onModuleInit(): Promise<void>;
    get<T>(key: string): Promise<T>;
    set(key: string, data: any, ttl?: number): Promise<void>;
    setOneCollection(mainCollectionName: string, relationCollectionNames: any): Promise<void>;
    getOneCollection(mainCollectionName: string): Promise<unknown>;
    deleteForDataCollection(mainCollectionName: string): Promise<void>;
    setDataForCollection(mainCollectionName: string, key: string, data: any): Promise<void>;
    private deleteForDataCollectionRelation;
    getDataForCollection(mainCollectionName: string, key: string): Promise<unknown>;
    resetCache(): Promise<void>;
    private getAllCollection;
}
