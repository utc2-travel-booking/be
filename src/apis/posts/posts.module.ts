import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { PostSchema } from './entities/posts.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.POST, schema: PostSchema },
        ]),
    ],
    controllers: [],
    providers: [PostsService],
    exports: [PostsService],
})
export class PostsModule {}
