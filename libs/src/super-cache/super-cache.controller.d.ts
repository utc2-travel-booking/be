import { SuperCacheService } from './super-cache.service';
export declare class SuperCacheController {
    private readonly superCacheService;
    constructor(superCacheService: SuperCacheService);
    reset(): Promise<void>;
}
