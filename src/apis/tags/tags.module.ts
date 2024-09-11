import { MongooseModule } from '@nestjs/mongoose';
import { TagsService } from './tags.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { TagSchema } from './entities/tags.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.TAG, schema: TagSchema },
        ]),
    ],
    controllers: [],
    providers: [TagsService],
    exports: [TagsService],
})
export class TagsModule {}
