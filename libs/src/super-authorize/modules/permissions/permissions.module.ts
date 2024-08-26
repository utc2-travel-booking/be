import { MongooseModule } from '@nestjs/mongoose';
import { PermissionsService } from './permissions.service';
import { Module } from '@nestjs/common';
import { PermissionSchema } from './entities/permissions.entity';
import { COLLECTION_NAMES } from 'src/constants';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.PERMISSION, schema: PermissionSchema },
        ]),
    ],
    controllers: [],
    providers: [PermissionsService],
    exports: [PermissionsService],
})
export class PermissionsModule {}
