import { MongooseModule } from '@nestjs/mongoose';
import { MetadataService } from './metadata.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { MetadataSchema } from './entities/metadata.entity';
import { SuperCacheModule } from 'src/packages/super-cache/super-cache.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.METADATA, schema: MetadataSchema },
        ]),
        SuperCacheModule,
    ],
    controllers: [],
    providers: [MetadataService],
    exports: [MetadataService],
})
export class MetadataModule {}
