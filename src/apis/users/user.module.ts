import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { UserService } from './user.service';
import { COLLECTION_NAMES } from 'src/constants';
import { SuperCacheModule } from '@libs/super-cache/super-cache.module';
import { MediaModule } from '../media/medias.module';
import { UserTransactionModule } from '../user-transaction/user-transaction.module';
import { MetadataModule } from '../metadata/metadata.module';
import { WebsocketModule } from 'src/packages/websocket/websocket.module';
import { UserReferralsModule } from '../user-referrals/user-referrals.module';
import { RolesModule } from '@libs/super-authorize/modules/roles/roles.module';
import { AppsModule } from '../apps/apps.module';
import { ExtendedMongooseModule } from '@libs/super-core/modules/mongoose/extended-mongoose.module';
@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.USER, schema: UserSchema },
        ]),
        ExtendedMongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.USER,
                schema: UserSchema,
                entity: User,
            },
        ]),
        forwardRef(() => RolesModule),
        forwardRef(() => UserReferralsModule),
        forwardRef(() => AppsModule),
        SuperCacheModule,
        MediaModule,
        UserTransactionModule,
        MetadataModule,
        WebsocketModule,
    ],
    controllers: [],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
