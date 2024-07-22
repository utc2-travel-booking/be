import { SetMetadata } from '@nestjs/common';
import { SUPER_CACHE_METADATA_KEY } from '../constants';

export interface SuperCacheOptions {
    mainCollectionName?: string;
    relationCollectionNames?: string[];
}

export const SuperCache = (options?: SuperCacheOptions) =>
    SetMetadata(SUPER_CACHE_METADATA_KEY.CATCH_RETURN_CLASS, options);
