import { Module } from '@nestjs/common';
import { MediaController } from 'src/apis/media/medias.controller';
import { MediaModule } from 'src/apis/media/medias.module';
import { UserController } from 'src/apis/users/user.controller';
import { UserModule } from 'src/apis/users/user.module';
import { CommonModule } from 'src/common/common.module';
import { AuthController } from 'src/apis/auth/auth.controller';
import { AuthModule } from 'src/apis/auth/auth.module';
import { CategoriesModule } from 'src/apis/categories/categories.module';
import { CategoriesController } from 'src/apis/categories/categories.controller';
import { PostsModule } from 'src/apis/posts/posts.module';
import { PostsController } from 'src/apis/posts/posts.controller';
import { MetadataController } from 'src/apis/metadata/metadata.controller';
import { MetadataModule } from 'src/apis/metadata/metadata.module';

@Module({
    imports: [
        CommonModule,
        UserModule,
        MediaModule,
        AuthModule,
        CategoriesModule,
        PostsModule,
        MetadataModule,
    ],
    controllers: [
        UserController,
        MediaController,
        AuthController,
        CategoriesController,
        PostsController,
        MetadataController,
    ],
    providers: [],
})
export class RouterFrontsModule {}
