import { PermissionsService } from './permissions.service';
import { Module } from '@nestjs/common';
import { Permission, PermissionSchema } from './entities/permissions.entity';
import { COLLECTION_NAMES } from 'src/constants';
import { PermissionsController } from './permissions.controller';
import { ExtendedMongooseModule } from '@libs/super-core/modules/mongoose/extended-mongoose.module';

@Module({
    imports: [
        ExtendedMongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.PERMISSION,
                schema: PermissionSchema,
                entity: Permission,
            },
        ]),
    ],
    controllers: [PermissionsController],
    providers: [PermissionsService],
    exports: [PermissionsService],
})
export class PermissionsModule {}
