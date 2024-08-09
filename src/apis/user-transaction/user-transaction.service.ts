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

    async checkReceivedReward(userId: Types.ObjectId, appId: Types.ObjectId) {
        const userTransactions = await this.findOne({
            'createdBy._id': userId,
            'app._id': appId,
        }).exec();

        return !_.isEmpty(userTransactions);
    }
}
