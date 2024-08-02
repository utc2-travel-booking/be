import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import {
    UserAppHistory,
    UserAppHistoryDocument,
} from './entities/user-app-histories.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UserAppHistoriesService extends BaseService<
    UserAppHistoryDocument,
    UserAppHistory
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.USER_APP_HISTORY)
        private readonly userAppHistoryDocument: Model<UserAppHistoryDocument>,
        eventEmitter: EventEmitter2,
    ) {
        super(
            userAppHistoryDocument,
            UserAppHistory,
            COLLECTION_NAMES.USER_APP_HISTORY,
            eventEmitter,
        );
    }

    async createUserAppHistory(appId: Types.ObjectId, userId: Types.ObjectId) {
        const userAppHistory = await this.findOne({
            'app._id': appId,
            'createdBy._id': userId,
        });

        if (userAppHistory) {
            await this.updateOne(
                { _id: userAppHistory._id },
                {
                    updatedAt: new Date(),
                },
            );

            return;
        }

        await this.create({
            app: appId,
            createdBy: userId,
        });
    }
}
