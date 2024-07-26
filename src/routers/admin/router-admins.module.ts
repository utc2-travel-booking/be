import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthController } from 'src/apis/admin/auth/auth.controller';
import { CategoriesController } from 'src/apis/admin/categories/categories.controller';
import { MediaController } from 'src/apis/admin/media/medias.controller';
import { MetadataController } from 'src/apis/admin/metadata/metadata.controller';
import { PostsController } from 'src/apis/admin/posts/posts.controller';
import { RolesController } from 'src/apis/admin/roles/roles.controller';
import { UserController } from 'src/apis/admin/users/user.controller';
import { AuthModule } from 'src/apis/auth/auth.module';
import { CategoriesModule } from 'src/apis/categories/categories.module';
import { MediaModule } from 'src/apis/media/medias.module';
import { MetadataModule } from 'src/apis/metadata/metadata.module';
import { PermissionsModule } from 'src/apis/permissions/permissions.module';
import { PostsModule } from 'src/apis/posts/posts.module';
import { RolesModule } from 'src/apis/roles/roles.module';
import { UserModule } from 'src/apis/users/user.module';
import { CommonModule } from 'src/common/common.module';
import { AuditsModule } from 'src/packages/audits/audits.module';
import { AuditsController } from 'src/packages/audits/controllers/admin/audits.controller';

@Module({
    imports: [
        ScheduleModule.forRoot(),
        CommonModule,
        UserModule,
        MediaModule,
        RolesModule,
        PermissionsModule,
        AuthModule,
        CategoriesModule,
        PostsModule,
        MetadataModule,
        AuditsModule,
    ],
    controllers: [
        MediaController,
        RolesController,
        AuthController,
        CategoriesController,
        PostsController,
        MetadataController,
        UserController,
        AuditsController,
    ],
    providers: [],
})
export class RouterAdminsModule {}
