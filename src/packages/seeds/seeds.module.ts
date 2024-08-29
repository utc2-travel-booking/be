import { SeedsService } from './seeds.service';
import { Module } from '@nestjs/common';
import { UserModule } from 'src/apis/users/user.module';
import { MetadataModule } from 'src/apis/metadata/metadata.module';
import { RolesModule } from '@libs/super-authorize/modules/roles/roles.module';

@Module({
    imports: [RolesModule, UserModule, MetadataModule],
    controllers: [],
    providers: [SeedsService],
    exports: [SeedsService],
})
export class SeedsModule {}
