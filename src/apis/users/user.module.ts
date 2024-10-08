import { Module } from '@nestjs/common';
import { User, UserSchema } from './entities/user.entity';
import { UserService } from './user.service';
import { COLLECTION_NAMES } from 'src/constants';
import { SuperCacheModule } from '@libs/super-cache/super-cache.module';
import { ExtendedMongooseModule } from '@libs/super-core/modules/mongoose/extended-mongoose.module';
@Module({
    imports: [
        ExtendedMongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.USER,
                schema: UserSchema,
                entity: User,
            },
        ]),
        SuperCacheModule,
    ],
    controllers: [],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
