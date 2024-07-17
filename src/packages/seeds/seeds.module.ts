import { PermissionsModule } from 'src/apis/permissions/permissions.module';
import { SeedsService } from './seeds.service';
import { Module } from '@nestjs/common';
import { RolesModule } from 'src/apis/roles/roles.module';
import { UserModule } from 'src/apis/users/user.module';
import { MetadataModule } from 'src/apis/metadata/metadata.module';

@Module({
    imports: [PermissionsModule, RolesModule, UserModule, MetadataModule],
    controllers: [],
    providers: [SeedsService],
    exports: [SeedsService],
})
export class SeedsModule {}
