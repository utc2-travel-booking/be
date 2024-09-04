import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UserControllerAdmin } from 'src/apis/users/controllers/user.controller.admin';
import { AuthModule } from 'src/apis/auth/auth.module';
import { AuthControllerAdmin } from 'src/apis/auth/controllers/auth.controller.admin';
import { CategoriesModule } from 'src/apis/categories/categories.module';
import { CategoriesControllerAdmin } from 'src/apis/categories/controllers/categories.controller.admin';
import { MediaControllerAdmin } from 'src/apis/media/controllers/medias.controller.admin';
import { MediaModule } from 'src/apis/media/medias.module';
import { MetadataControllerAdmin } from 'src/apis/metadata/controllers/metadata.controller.admin';
import { MetadataModule } from 'src/apis/metadata/metadata.module';
import { PostsControllerAdmin } from 'src/apis/posts/controllers/posts.controller.admin';
import { PostsModule } from 'src/apis/posts/posts.module';
import { UserModule } from 'src/apis/users/user.module';
import { CommonModule } from 'src/common/common.module';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        CommonModule,
        UserModule,
        MediaModule,
        AuthModule,
        CategoriesModule,
        PostsModule,
        MetadataModule,
    ],
    controllers: [
        MediaControllerAdmin,
        AuthControllerAdmin,
        CategoriesControllerAdmin,
        PostsControllerAdmin,
        MetadataControllerAdmin,
        UserControllerAdmin,
    ],
    providers: [],
})
export class RouterAdminsModule {}
