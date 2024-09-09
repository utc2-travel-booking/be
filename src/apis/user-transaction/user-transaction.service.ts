import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import {
    UserTransaction,
    UserTransactionDocument,
} from './entities/user-transaction.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, Types } from 'mongoose';
import _ from 'lodash';
import { ModuleRef } from '@nestjs/core';
import { MetadataType } from '../metadata/constants';

@Injectable()
export class UserTransactionService extends BaseService<
    UserTransactionDocument,
    UserTransaction
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.USER_TRANSACTION)
        private readonly userTransactionModel: Model<UserTransactionDocument>,
        moduleRef: ModuleRef,
    ) {
        super(
            userTransactionModel,
            UserTransaction,
            COLLECTION_NAMES.USER_TRANSACTION,
            moduleRef,
        );
    }

    async checkReceivedReward(
        userId: Types.ObjectId,
        appId: Types.ObjectId,
        action: MetadataType,
    ) {
        if (!userId || !appId) {
            return false;
        }
        const userTransactions = await this.findOne({
            createdBy: userId,
            app: appId,
            action,
        })
            .autoPopulate(false)
            .exec();

        return !_.isEmpty(userTransactions);
    }

    async checkLimitReceivedReward(userId: Types.ObjectId, action: string[]) {
        if (!userId) {
            return 0;
        }

        const userTransactions = await this.countDocuments({
            createdBy: new Types.ObjectId(userId),
            action: { $in: action },
            createdAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
                $lte: new Date(new Date().setHours(23, 59, 59, 999)),
            },
        })
            .autoPopulate(false)
            .exec();

        return userTransactions;
    }
}
