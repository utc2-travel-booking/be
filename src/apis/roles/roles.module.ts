import { MongooseModule } from '@nestjs/mongoose';
import { RolesService } from './roles.service';
import { Module } from '@nestjs/common';
import { RoleSchema } from './entities/roles.entity';
import { COLLECTION_NAMES } from 'src/constants';
import { SuperCacheModule } from '@libs/super-cache/super-cache.module';
import { PermissionsModule } from '@libs/super-authorize/modules/permissions/permissions.module';

@Module({
    imports: [
        SuperCacheModule,
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.ROLE, schema: RoleSchema },
        ]),
        PermissionsModule,
    ],
    controllers: [],
    providers: [RolesService],
    exports: [RolesService],
})
export class RolesModule {}
