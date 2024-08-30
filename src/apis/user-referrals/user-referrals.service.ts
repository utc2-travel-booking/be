import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import {
    UserReferral,
    UserReferralDocument,
} from './entities/user-referrals.entitiy';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model } from 'mongoose';
import { ModuleRef } from '@nestjs/core';

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
}
