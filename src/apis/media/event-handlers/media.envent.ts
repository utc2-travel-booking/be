import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MEDIA_EVENT_HANDLER } from '../constants';
import { MediaService } from '../medias.service';

@Injectable()
export class MediaEvent {
    private readonly logger = new Logger(MediaEvent.name);
    constructor(private readonly mediaService: MediaService) {}

    @OnEvent(MEDIA_EVENT_HANDLER.MIGRATE_FILE_TON_TO_S3)
    async migrateFileToS3() {
        this.logger.debug('Migrate file to S3');
        await this.mediaService.migrateFileToS3();
        this.logger.debug('Migrate file to S3 done');
    }
}
