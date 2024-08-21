import { SuperCacheService } from '../super-cache.service';
import { COLLECTION_NAMES } from 'src/constants';
export declare class SuperCacheEvent {
    private readonly superCacheService;
    private readonly logger;
    constructor(superCacheService: SuperCacheService);
    handleDeleteCacheEvent(collectionName: COLLECTION_NAMES): Promise<void>;
    handleSetCacheEvent(collectionName: COLLECTION_NAMES, key: string, result: any): Promise<void>;
}
