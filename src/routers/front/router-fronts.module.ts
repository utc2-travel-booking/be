import { Module } from '@nestjs/common';
import { MediaModule } from 'src/apis/media/medias.module';
import { UserModule } from 'src/apis/users/user.module';
import { CommonModule } from 'src/common/common.module';
import { AuthModule } from 'src/apis/auth/auth.module';
import { CategoriesModule } from 'src/apis/categories/categories.module';
import { PostsModule } from 'src/apis/posts/posts.module';
import { MetadataModule } from 'src/apis/metadata/metadata.module';
import { CategoriesController } from 'src/apis/categories/controllers/categories.controller';
import { AuthController } from 'src/apis/auth/controllers/auth.controller';
import { MediaController } from 'src/apis/media/controllers/medias.controller';
import { MetadataController } from 'src/apis/metadata/controllers/metadata.controller';
import { PostsController } from 'src/apis/posts/controllers/posts.controller';
import { UserController } from 'src/apis/users/controllers/user.controller';
import { AppsController } from 'src/apis/apps/controllers/apps.controller';
import { AppsModule } from 'src/apis/apps/apps.module';
import { ReviewsController } from 'src/apis/reviews/controllers/reviews.controller';
import { ReviewsModule } from 'src/apis/reviews/reviews.module';

@Module({
    imports: [
        CommonModule,
        UserModule,
        MediaModule,
        AuthModule,
        CategoriesModule,
        PostsModule,
        MetadataModule,
        AppsModule,
        ReviewsModule,
    ],
    controllers: [
        UserController,
        MediaController,
        AuthController,
        CategoriesController,
        PostsController,
        MetadataController,
        AppsController,
        ReviewsController,
    ],
    providers: [],
})
export class RouterFrontsModule {}
