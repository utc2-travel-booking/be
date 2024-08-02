import { Module } from '@nestjs/common';
import { AppsModule } from 'src/apis/apps/apps.module';
import { AppsController } from 'src/apis/apps/controllers/apps.controller';
import { CategoriesModule } from 'src/apis/categories/categories.module';
import { CategoriesController } from 'src/apis/categories/controllers/categories.controller';
import { PostsController } from 'src/apis/posts/controllers/posts.controller';
import { PostsModule } from 'src/apis/posts/posts.module';

@Module({
    imports: [PostsModule, AppsModule, CategoriesModule],
    controllers: [PostsController, AppsController, CategoriesController],
    providers: [],
})
export class RouterFrontLocaleModule {}
