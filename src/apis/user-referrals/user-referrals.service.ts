import {
    BadRequestException,
    forwardRef,
    Inject,
    Injectable,
} from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import {
    UserReferral,
    UserReferralDocument,
} from './entities/user-referrals.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, Types } from 'mongoose';
import { ModuleRef } from '@nestjs/core';
import { UserDocument } from '../users/entities/user.entity';
import { UserService } from '../users/user.service';
import {
    UserTransactionAction,
    UserTransactionType,
} from '../user-transaction/constants';
import { MetadataService } from '../metadata/metadata.service';
import { UserTransactionService } from '../user-transaction/user-transaction.service';
import { WebsocketGateway } from 'src/packages/websocket/websocket.gateway';

@Injectable()
export class UserReferralsService extends BaseService<
    UserReferralDocument,
    UserReferral
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.USER_REFERRAL)
        private readonly userReferralModel: Model<UserReferralDocument>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly metadataService: MetadataService,
        private readonly userTransactionService: UserTransactionService,
        private readonly websocketGateway: WebsocketGateway,
        moduleRef: ModuleRef,
    ) {
        super(
            userReferralModel,
            UserReferral,
            COLLECTION_NAMES.USER_REFERRAL,
            moduleRef,
        );
    }

    async getReferralFront(userId: Types.ObjectId) {
        const user = await this.userService.findOne({ _id: userId }).exec();

        const referralList = await this.find({ code: user.inviteCode }).exec();

        const resultList = await Promise.all(
            referralList.map(async (referral) => {
                const result = await this.userService
                    .findOne({
                        telegramUserId: referral.telegramUserId,
                    })
                    .exec();

                return result.name;
            }),
        );

        return resultList;
    }

    async getReferral(users: UserDocument[]) {
        const result = await Promise.all(
            users.map(async (user) => {
                const countReferral = await this.countDocuments({
                    code: user.inviteCode,
                }).exec();
                const introducer = await this.findOne({
                    telegramUserId: user.telegramUserId,
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

    async createReferral(telegramUserId: number, inviteCode: string) {
        await this.validateUserAndReferral(inviteCode);

        await this.create({
            telegramUserId,
            code: inviteCode,
        });

        await this.addPointForUserReferralAndUserReferred(
            telegramUserId,
            inviteCode,
        );
    }
    async createReferralTransaction(
        userId: Types.ObjectId,
        type: UserTransactionType,
        amount: number,
        before: number,
        after: number,
        refSource: string,
        refId: Types.ObjectId,
        action: string,
    ) {
        if (amount === 0) {
            return 0;
        }

        const userTransaction = await this.userTransactionService.create({
            createdBy: new Types.ObjectId(userId),
            type,
            amount,
            before,
            after,
            refSource: refSource,
            refId: new Types.ObjectId(refId?._id),
            action,
        });

        if (userTransaction) {
            await this.userService.updateOne(
                { _id: new Types.ObjectId(userId.toString()) },
                {
                    currentPoint: after,
                },
            );

            this.websocketGateway.sendPointsUpdate(userId, after);

            return amount;
        }
    }

    async validateUserAndReferral(inviteCode: string) {
        const referralCode = await this.userService
            .findOne({
                inviteCode,
            })
            .exec();

        if (!referralCode) {
            throw new BadRequestException('Invalid referral code');
        }
    }

    private async addPointForReferral(
        user: UserDocument,
        type: UserTransactionAction,
    ) {
        const amountRewardReferral =
            await this.metadataService.getAmountRewardReferral();

        const after = user.currentPoint + amountRewardReferral.value['reward'];

        await this.createReferralTransaction(
            user._id,
            UserTransactionType.SUM,
            amountRewardReferral.value['reward'],
            user.currentPoint,
            after,
            COLLECTION_NAMES.METADATA,
            amountRewardReferral._id,
            type,
        );
    }

    async addPointForUserReferralAndUserReferred(
        telegramId: number,
        code: string,
    ) {
        // Add point for referrer
        const referrer = await this.userService
            .findOne({
                inviteCode: code,
            })
            .exec();

        await this.addPointForReferral(
            referrer,
            UserTransactionAction.REFERRAL,
        );
        // Add point for user referred

        const user = await this.userService
            .findOne({
                telegramUserId: telegramId,
            })
            .exec();

        await this.addPointForReferral(user, UserTransactionAction.REFERRED);
    }
}
