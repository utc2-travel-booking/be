import { MongooseModule } from '@nestjs/mongoose';
import { RolesService } from './roles.service';
import { Module } from '@nestjs/common';
import { RoleSchema } from './entities/roles.entity';
import { COLLECTION_NAMES } from 'src/constants';
import { CacheManagerModule } from 'src/packages/cache-manager/cache-manager.module';

@Module({
    imports: [
        CacheManagerModule,
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.ROLE, schema: RoleSchema },
        ]),
    ],
    controllers: [],
    providers: [RolesService],
    exports: [RolesService],
})
export class RolesModule {}
