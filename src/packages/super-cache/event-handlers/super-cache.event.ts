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
        this.logger.debug(`Deleted cache event ${collectionName}...`);
        await this.superCacheService.deleteForDataCollection(collectionName);
        this.logger.debug(`Deleted cache event ${collectionName}...done`);
    }
}
