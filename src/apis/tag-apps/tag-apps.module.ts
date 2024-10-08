import { TagAppsService } from './tag-apps.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { TagApp, TagAppSchema } from './entities/tag-apps.entity';
import { ExtendedMongooseModule } from '@libs/super-core/modules/mongoose/extended-mongoose.module';

@Module({
    imports: [
        ExtendedMongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.TAG_APP,
                schema: TagAppSchema,
                entity: TagApp,
            },
        ]),
    ],
    controllers: [],
    providers: [TagAppsService],
    exports: [TagAppsService],
})
export class TagAppsModule {}
