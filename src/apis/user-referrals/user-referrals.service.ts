import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import {
    UserReferral,
    UserReferralDocument,
} from './entities/user-referrals.entitiy';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model } from 'mongoose';
import { ModuleRef } from '@nestjs/core';
import { UserDocument } from '../users/entities/user.entity';
import { ReferralStatus } from './constants';
import { UserService } from '../users/user.service';

@Injectable()
export class UserReferralsService extends BaseService<
    UserReferralDocument,
    UserReferral
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.USER_REFERRAL)
        private readonly userReferralModel: Model<UserReferralDocument>,
        moduleRef: ModuleRef,
    ) {
        super(
            userReferralModel,
            UserReferral,
            COLLECTION_NAMES.USER_REFERRAL,
            moduleRef,
        );
    }

    async getReferral(users: UserDocument[]) {
        const result = await Promise.all(
            users.map(async (user) => {
                const countReferral = await this.countDocuments({
                    code: user.inviteCode,
                    status: ReferralStatus.COMPLETED,
                }).exec();
                const introducer = await this.findOne({
                    telegramUserId: user.telegramUserId,
                    status: ReferralStatus.COMPLETED,
                }).exec();

                return {
                    ...user,
                    referralCount: countReferral,
                    introducer: introducer?.code,
                };
            }),
        );

        return result;
    }
    async validateReferral(telegramId: number) {
        const referral = await this.findOne({
            telegramUserId: telegramId,
        }).exec();
        if (referral) {
            console.log('referral', referral);
            throw new BadRequestException('User entered referral code');
        }
    }
}
