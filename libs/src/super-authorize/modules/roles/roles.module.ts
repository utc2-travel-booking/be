import { RolesService } from './roles.service';
import { Module } from '@nestjs/common';
import { Role, RoleSchema } from './entities/roles.entity';
import { COLLECTION_NAMES } from 'src/constants';
import { PermissionsModule } from '@libs/super-authorize/modules/permissions/permissions.module';
import { RolesController } from './roles.controller';
import { ExtendedMongooseModule } from '@libs/super-core/modules/mongoose/extended-mongoose.module';

@Module({
    imports: [
        ExtendedMongooseModule.forFeature([
            { name: COLLECTION_NAMES.ROLE, schema: RoleSchema, entity: Role },
        ]),
        PermissionsModule,
    ],
    controllers: [RolesController],
    providers: [RolesService],
    exports: [RolesService],
})
export class RolesModule {}
