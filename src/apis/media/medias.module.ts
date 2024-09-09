import { Module } from '@nestjs/common';
import { MediaService } from './medias.service';
import { S3Module } from 'src/packages/s3/s3.module';
import { MongooseModule } from '@nestjs/mongoose';
import { FileSchema } from './entities/files.entity';
import { COLLECTION_NAMES } from 'src/constants';
import { MediaEvent } from './event-handlers/media.envent';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.FILE,
                schema: FileSchema,
            },
        ]),
        S3Module,
    ],
    controllers: [],
    providers: [MediaService, MediaEvent],
    exports: [MediaService],
})
export class MediaModule {}
