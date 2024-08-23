import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './entities/user.entity';
import { UserService } from './user.service';
import { COLLECTION_NAMES } from 'src/constants';
import { RolesModule } from '../roles/roles.module';
import { SuperCacheModule } from '@libs/super-cache/super-cache.module';
import { MediaModule } from '../media/medias.module';
import { MetadataModule } from '../metadata/metadata.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.USER, schema: UserSchema },
        ]),
        forwardRef(() => RolesModule),
        SuperCacheModule,
        MediaModule,
        MetadataModule,
    ],
    controllers: [],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
