import { Module } from '@nestjs/common';
import { MediaService } from './medias.service';
import { S3Module } from 'src/packages/s3/s3.module';
import { File, FileSchema } from './entities/files.entity';
import { COLLECTION_NAMES } from 'src/constants';
import { ExtendedMongooseModule } from '@libs/super-core/modules/mongoose/extended-mongoose.module';

@Module({
    imports: [
        ExtendedMongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.FILE,
                schema: FileSchema,
                entity: File,
            },
        ]),
        S3Module,
    ],
    controllers: [],
    providers: [MediaService],
    exports: [MediaService],
})
export class MediaModule {}
