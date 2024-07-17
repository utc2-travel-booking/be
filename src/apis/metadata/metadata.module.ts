import { MongooseModule } from '@nestjs/mongoose';
import { MetadataService } from './metadata.service';
import { forwardRef, Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { MetadataSchema } from './entities/metadata.entity';
import { CacheManagerModule } from 'src/packages/cache-manager/cache-manager.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.METADATA, schema: MetadataSchema },
        ]),
        CacheManagerModule,
    ],
    controllers: [],
    providers: [MetadataService],
    exports: [MetadataService],
})
export class MetadataModule {}
