import { MongooseModule } from '@nestjs/mongoose';
import { UserReferralsService } from './user-referrals.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { UserReferralSchema } from './entities/user-referrals.entitiy';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.USER_REFERRAL,
                schema: UserReferralSchema,
            },
        ]),
    ],
    controllers: [],
    providers: [UserReferralsService],
    exports: [UserReferralsService],
})
export class UserReferralsModule {}
