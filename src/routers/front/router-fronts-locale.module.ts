import { Module } from '@nestjs/common';
import { PostsModule } from 'src/apis/posts/posts.module';
import { PostsController } from 'src/apis/posts/posts.controller';

@Module({
    imports: [PostsModule],
    controllers: [PostsController],
    providers: [],
})
export class RouterFrontLocaleModule {}
