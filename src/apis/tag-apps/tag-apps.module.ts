import { MongooseModule } from '@nestjs/mongoose';
import { TagAppsService } from './tag-apps.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { TagAppSchema } from './entities/tag-apps.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.TAG_APP, schema: TagAppSchema },
        ]),
    ],
    controllers: [],
    providers: [TagAppsService],
    exports: [TagAppsService],
})
export class TagAppsModule {}
