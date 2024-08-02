import { Module } from '@nestjs/common';
import { AppsModule } from 'src/apis/apps/apps.module';
import { AppsControllerAdmin } from 'src/apis/apps/controllers/apps.controller.admin';
import { CategoriesModule } from 'src/apis/categories/categories.module';
import { CategoriesControllerAdmin } from 'src/apis/categories/controllers/categories.controller.admin';
import { PostsControllerAdmin } from 'src/apis/posts/controllers/posts.controller.admin';
import { PostsModule } from 'src/apis/posts/posts.module';

@Module({
    imports: [PostsModule, AppsModule, CategoriesModule],
    controllers: [
        PostsControllerAdmin,
        AppsControllerAdmin,
        CategoriesControllerAdmin,
    ],
    providers: [],
})
export class RoutesAdminLocaleModule {}
