import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import {
    UserAppHistory,
    UserAppHistoryDocument,
} from './entities/user-app-histories.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, Types } from 'mongoose';
import { ModuleRef } from '@nestjs/core';
import { ActionType } from './constants';
import { compareWithToday } from 'src/utils/helper';

@Injectable()
export class UserAppHistoriesService extends BaseService<
    UserAppHistoryDocument,
    UserAppHistory
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.USER_APP_HISTORY)
        private readonly userAppHistoryDocument: Model<UserAppHistoryDocument>,
        moduleRef: ModuleRef,
    ) {
        super(
            userAppHistoryDocument,
            UserAppHistory,
            COLLECTION_NAMES.USER_APP_HISTORY,
            moduleRef,
        );
    }

    async createUserAppHistory(appId: Types.ObjectId, userId: Types.ObjectId, action?: ActionType) {
        const userAppHistory = await this.findOne({
            app: new Types.ObjectId(appId.toString()),
            createdBy: new Types.ObjectId(userId.toString()),
            action
        })
            .autoPopulate(false)
            .exec();

        if (userAppHistory) {
            const history: any = userAppHistory;
            const date = history.updatedAt;
            await this.updateOne(
                { _id: userAppHistory._id },
                {
                    updatedAt: new Date(),
                },
            );
            return !compareWithToday(date);
        }

        await this.create({
            app: new Types.ObjectId(appId.toString()),
            createdBy: userId,
            action
        });
        return true;
    }
}
