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
import { ReferralStatus } from './constants';
import { UserService } from '../users/user.service';
import {
    UserTransactionAction,
    UserTransactionType,
} from '../user-transaction/constants';
import { MetadataService } from '../metadata/metadata.service';
import { UserTransactionService } from '../user-transaction/user-transaction.service';
import { WebsocketGateway } from 'src/packages/websocket/websocket.gateway';
import { CreateUserReferralDto } from './dto/create-referral.dto';
import * as bcrypt from 'bcryptjs';

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

    async createReferral(Referral: CreateUserReferralDto) {
        const { inviteCode, telegramUserId, key } = Referral;

        const isMatch =
            key &&
            process.env.KEY_REFERRAL &&
            (await bcrypt.compare(process.env.KEY_REFERRAL, key));

        if (!isMatch) {
            throw new BadRequestException('Wrong security key');
        }

        await this.validateUserAndReferral(telegramUserId, inviteCode);

        await this.create({
            telegramUserId,
            code: inviteCode,
        });
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

    async validateUserAndReferral(telegramId: number, inviteCode: string) {
        const user = await this.userService
            .findOne({
                telegramUserId: telegramId,
            })
            .exec();
        if (user) {
            throw new BadRequestException('Invalid user');
        }

        const referralCode = await this.userService
            .findOne({
                inviteCode,
            })
            .exec();

        if (!referralCode) {
            throw new BadRequestException('Invalid referral code');
        }

        const referral = await this.findOne({
            telegramUserId: telegramId,
        }).exec();
        if (referral) {
            throw new BadRequestException('User entered referral code');
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

    async addPointForUserReferralAndUserReferred(user: UserDocument) {
        const referralPending = await this.findOne({
            telegramUserId: user.telegramUserId,
            status: ReferralStatus.PENDING,
        }).exec();

        if (referralPending) {
            const referrer = await this.userService
                .findOne({
                    inviteCode: user.inviteCode,
                })
                .exec();
            // Add point for referrer
            await this.addPointForReferral(
                referrer,
                UserTransactionAction.REFERRAL,
            );
            // Add point for user referred
            await this.addPointForReferral(
                user,
                UserTransactionAction.REFERRED,
            );

            // Update status of referral
            await this.updateOne(
                {
                    telegramUserId: user.telegramUserId,
                },
                {
                    status: ReferralStatus.COMPLETED,
                },
            );
        }
    }
}
