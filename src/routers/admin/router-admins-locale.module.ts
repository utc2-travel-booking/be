import { Module } from '@nestjs/common';
import { PostsController } from 'src/apis/admin/posts/posts.controller';
import { PostsModule } from 'src/apis/posts/posts.module';

@Module({
    imports: [PostsModule],
    controllers: [PostsController],
    providers: [],
})
export class RoutesAdminLocaleModule {}
