import { TagsService } from './tags.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { Tag, TagSchema } from './entities/tags.entity';
import { ExtendedMongooseModule } from '@libs/super-core/modules/mongoose/extended-mongoose.module';

@Module({
    imports: [
        ExtendedMongooseModule.forFeature([
            { name: COLLECTION_NAMES.TAG, schema: TagSchema, entity: Tag },
        ]),
    ],
    controllers: [],
    providers: [TagsService],
    exports: [TagsService],
})
export class TagsModule {}
