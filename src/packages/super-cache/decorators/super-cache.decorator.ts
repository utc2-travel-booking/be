import { SetMetadata } from '@nestjs/common';
import { CATCH_RETURN_CLASS } from '../constants';

export interface SuperCacheOptions {
    mainCollectionName?: string;
    relationCollectionNames?: string[];
}

export const SuperCache = (options?: SuperCacheOptions) =>
    SetMetadata(CATCH_RETURN_CLASS, options);
