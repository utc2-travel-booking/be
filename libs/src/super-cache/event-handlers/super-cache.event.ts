import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SuperCacheService } from '../super-cache.service';
import { SUPER_CACHE_EVENT_HANDLER } from '../constants';
import { COLLECTION_NAMES } from 'src/constants';

@Injectable()
export class SuperCacheEvent {
    private readonly logger = new Logger(SuperCacheEvent.name);
    constructor(private readonly superCacheService: SuperCacheService) {}

    @OnEvent(SUPER_CACHE_EVENT_HANDLER.DELETE)
    async handleDeleteCacheEvent(collectionName: COLLECTION_NAMES) {
        await this.superCacheService.deleteForDataCollection(collectionName);
    }

    @OnEvent(SUPER_CACHE_EVENT_HANDLER.SET)
    async handleSetCacheEvent(
        collectionName: COLLECTION_NAMES,
        key: string,
        result: any,
    ) {
        await this.superCacheService.setDataForCollection(
            collectionName,
            key,
            result,
        );
    }
}
