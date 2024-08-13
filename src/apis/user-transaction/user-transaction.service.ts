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
import { TYPE_ADD_POINT_FOR_USER } from '../apps/constants';

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
        if (!userId || !appId) {
            return false;
        }
        const userTransactions = await this.findOne({
            createdBy: new Types.ObjectId(userId),
            app: new Types.ObjectId(appId),
            description: TYPE_ADD_POINT_FOR_USER.open,
        })
            .autoPopulate(false)
            .exec();

        return !_.isEmpty(userTransactions);
    }
}
