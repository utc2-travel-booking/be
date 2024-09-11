import { MongooseModule } from '@nestjs/mongoose';
import { UserReferralsService } from './user-referrals.service';
import { forwardRef, Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { UserReferralSchema } from './entities/user-referrals.entity';
import { UserModule } from '../users/user.module';
import { MetadataModule } from '../metadata/metadata.module';
import { UserTransactionModule } from '../user-transaction/user-transaction.module';
import { WebsocketModule } from 'src/packages/websocket/websocket.module';
import { MissionModule } from '../mission/mission.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.USER_REFERRAL,
                schema: UserReferralSchema,
            },
        ]),
        forwardRef(() => UserModule),
        // forwardRef(() => MissionModule),

        MetadataModule,
        UserTransactionModule,
        WebsocketModule,
    ],
    controllers: [],
    providers: [UserReferralsService],
    exports: [UserReferralsService],
})
export class UserReferralsModule {}
