import {
    BadRequestException,
    Injectable,
    OnModuleInit,
    UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { BaseService } from 'src/base/service/base.service';
import { User, UserDocument } from './entities/user.entity';
import { COLLECTION_NAMES } from 'src/constants';
import { UserPayload } from 'src/base/models/user-payload.model';
import { UpdateMeDto } from './dto/update-me.dto';
import _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import { UserCacheKey, UserStatus } from './constants';
import { SuperCacheService } from '@libs/super-cache/super-cache.service';
import { UserLoginTelegramDto } from '../auth/dto/user-login-telegram.dto';
import { MediaService } from '../media/medias.service';
import { ModuleRef } from '@nestjs/core';
import { CreateUserDto } from './dto/create-user.dto';
import { UserTransactionService } from '../user-transaction/user-transaction.service';
import { UserTransactionType } from '../user-transaction/constants';
import { AddPointForUserDto, AddPointMissionDto } from '../apps/models/add-point-for-user.model';
import { AppDocument } from '../apps/entities/apps.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { MetadataType } from '../metadata/constants';
import { MetadataService } from '../metadata/metadata.service';
import { WebsocketGateway } from 'src/packages/websocket/websocket.gateway';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateNotificationModel } from '../notifications/models/create-notification.model';
import { NOTIFICATION_EVENT_HANDLER } from '../notifications/constants';
import { generateRandomString } from './common/generate-random-string.util';
import { UserReferralsService } from '../user-referrals/user-referrals.service';
import { RolesService } from '@libs/super-authorize/modules/roles/roles.service';
import { RoleType } from '@libs/super-authorize/modules/roles/constants';

@Injectable()
export class UserService
    extends BaseService<UserDocument, User>
    implements OnModuleInit {
    constructor(
        @InjectModel(COLLECTION_NAMES.USER)
        private readonly userModel: Model<UserDocument>,
        private readonly roleService: RolesService,
        private readonly superCacheService: SuperCacheService,
        private readonly mediaService: MediaService,
        moduleRef: ModuleRef,
        private readonly userTransactionService: UserTransactionService,
        private readonly userReferralService: UserReferralsService,
        private readonly metadataService: MetadataService,
        private readonly websocketGateway: WebsocketGateway,
        private readonly eventEmitter: EventEmitter2,
        private readonly userReferralsService: UserReferralsService,
    ) {
        super(userModel, User, COLLECTION_NAMES.USER, moduleRef);
    }

    async onModuleInit() {
        const usersBanned = await this.find({
            status: UserStatus.INACTIVE,
        }).exec();
        const usersDeleted = await this.find({
            deletedAt: { $ne: null },
        }).exec();

        if (usersBanned.length) {
            const ids = usersBanned.map((user) => user._id);

            await this.addCacheBannedUser(ids);
        }

        if (usersDeleted.length) {
            const ids = usersDeleted.map((user) => user._id);

            await this.addCacheBannedUser(ids);
        }

        await this.addInviteCodeForUser();
    }

    async getAllAdmin(queryParams) {
        const result = await this.getAll(queryParams);
        const countReferral = await this.userReferralService.getReferral(
            result.items,
        );

        return {
            items: countReferral,
            meta: result.meta,
        };
    }

    async getHistoryReward(user: UserPayload, action: MetadataType) {
        const result = {
            today: 0,
            yesterday: 0,
            lastOneMonth: 0,
        };

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const lastOneMonth = new Date();
        lastOneMonth.setMonth(lastOneMonth.getMonth() - 1);
        lastOneMonth.setHours(0, 0, 0, 0);

        const userTransactionToday = await this.userTransactionService
            .find({
                'createdBy._id': user._id,
                createdAt: { $gte: today },
                action,
            })
            .exec();

        const userTransactionYesterday = await this.userTransactionService
            .find({
                'createdBy._id': user._id,
                createdAt: { $gte: yesterday, $lt: today },
                action,
            })
            .exec();

        const userTransactionLastOneMonth = await this.userTransactionService
            .find({
                'createdBy._id': user._id,
                createdAt: { $gte: lastOneMonth },
                action,
            })
            .exec();

        result.today = userTransactionToday.reduce(
            (acc, cur) => acc + cur.amount,
            0,
        );

        result.yesterday = userTransactionYesterday.reduce(
            (acc, cur) => acc + cur.amount,
            0,
        );

        result.lastOneMonth = userTransactionLastOneMonth.reduce(
            (acc, cur) => acc + cur.amount,
            0,
        );

        return result;
    }
    async addPointUserCompletedMission(
        userPayload: UserPayload,
        addPointForUserDto: AddPointMissionDto
    ) {
        const { _id: userId } = userPayload;
        const mission = addPointForUserDto;
        const type = UserTransactionType.SUM
        const userTransactionThisApp = await this.userTransactionService
            .findOne({
                createdBy: new Types.ObjectId(userId),
                "mission._id": mission._id
            })
            .autoPopulate(false)
            .exec();

        if (userTransactionThisApp) {
            return await this.getMe(userPayload);
        }
        const user = await this.findOne({ _id: userId }).exec();

        const { currentPoint = 0, _id } = user;
        const after = parseFloat(currentPoint.toString()) + mission.reward;

        const userTransaction = await this.userTransactionService.create({
            createdBy: _id,
            type,
            amount: mission.reward,
            before: currentPoint,
            after,
            mission
        });

        if (userTransaction) {
            await this.updateOne(
                { _id },
                {
                    currentPoint: after,
                },
            );

            this.websocketGateway.sendPointsUpdate(userId, after);

            this.eventEmitter.emit(NOTIFICATION_EVENT_HANDLER.CREATE, {
                name: `+${mission.reward}`,
                userId: new Types.ObjectId(userId),
                shortDescription: `You have completed the task of ${mission.name}`,
                refSource: COLLECTION_NAMES.MISSION,
            } as CreateNotificationModel);
        }

        return await this.getMe(userPayload);
    }
    async addPointForUser(
        addPointForUserDto: AddPointForUserDto,
        appDocument: AppDocument,
        userPayload: UserPayload,
        actionTransaction: string,
    ) {
        const { _id: userId } = userPayload;
        const { point, type, action, app, name, limit } = addPointForUserDto;
        const { name: appName } = appDocument;

        const userTransactionThisApp = await this.userTransactionService
            .findOne({
                createdBy: new Types.ObjectId(userId),
                app: new Types.ObjectId(app),
                action: actionTransaction,
            })
            .autoPopulate(false)
            .exec();

        if (userTransactionThisApp) {
            return await this.getMe(userPayload);
        }

        const countReceivedReward =
            await this.userTransactionService.checkLimitReceivedReward(
                userId,
                action,
            );

        if (countReceivedReward >= limit) {
            throw new BadRequestException(
                'limit_received_reward',
                'You have reached the limit of receiving rewards',
            );
        }

        const user = await this.findOne({ _id: userId }).exec();

        const { currentPoint = 0, _id } = user;

        const after =
            type === UserTransactionType.SUM
                ? parseFloat(currentPoint.toString()) + point
                : parseFloat(currentPoint.toString()) - point;

        const userTransaction = await this.userTransactionService.create({
            createdBy: _id,
            type,
            amount: point,
            before: currentPoint,
            after,
            app: new Types.ObjectId(app.toString()),
            action: actionTransaction,
        });

        if (userTransaction) {
            await this.updateOne(
                { _id },
                {
                    currentPoint: after,
                },
            );

            this.websocketGateway.sendPointsUpdate(userId, after);

            this.eventEmitter.emit(NOTIFICATION_EVENT_HANDLER.CREATE, {
                name: `+${point}`,
                userId: new Types.ObjectId(userId),
                refId: new Types.ObjectId(app),
                shortDescription: `You ${name} ${appName}`,
                refSource: COLLECTION_NAMES.APP,
            } as CreateNotificationModel);

            await this.checkLimitReceivedRewardForDay(userId);
        }

        return await this.getMe(userPayload);
    }

    async createUserTelegram(
        userLoginTelegramDto: Partial<UserLoginTelegramDto>,
        inviteCode?: string,
    ): Promise<UserDocument> {
        const {
            id,
            first_name: firstName = '',
            last_name: lastName = '',
            photo_url: photoUrl,
            username,
        } = userLoginTelegramDto;

        const user = await this.findOne({ telegramUserId: id }).exec();

        if (user) {
            return user;
        }

        let avatar = null;
        if (photoUrl) {
            avatar = await this.mediaService.create({
                name: `avatar-${id}`,
                filePath: photoUrl,
                filename: `avatar-${id}`,
            });
        }

        const role = await this.roleService.getRoleByType(RoleType.USER);

        const newUser = await this.create({
            name: `${firstName} ${lastName}`,
            telegramUserId: id,
            telegramUsername: username,
            avatar: _.get(avatar, '_id', null),
            role: role._id,
        });

        if (newUser && inviteCode) {
            await this.userReferralService.createReferral(
                newUser.telegramUserId,
                inviteCode,
            );
        }

        return newUser;
    }

    async createOne(
        createUserDto: CreateUserDto,
        user: UserPayload,
        options?: Record<string, any>,
    ) {
        const { _id: userId } = user;
        const { password } = createUserDto;

        const result = new this.model({
            ...createUserDto,
            ...options,
            createdBy: userId,
            password: await this.hashPassword(password),
        });
        await this.create(result);

        return result;
    }

    async updateOneById(
        _id: Types.ObjectId,
        updateUserDto: UpdateUserDto,
        userPayload: UserPayload,
        options?: Record<string, any>,
    ) {
        const { _id: userId } = userPayload;
        const { password } = updateUserDto;

        const update = {
            ...updateUserDto,
            ...options,
            updatedBy: userId,
            password: await this.hashPassword(password),
        };

        const user = await this.findOne({ _id }).exec();

        if (!user) {
            throw new BadRequestException(`Not found ${_id}`);
        }

        if (user.password === update.password) {
            delete update.password;
        }

        const result = await this.updateOne(
            { _id },
            {
                ...update,
            },
        );

        return result;
    }

    async validateUserLocal(email: string, password: string) {
        if (!email || !password) {
            throw new UnprocessableEntityException(
                'email_password_incorrectly',
                'Email or password incorrectly',
            );
        }

        const user = await this.findOne({ email }).exec();

        const isMatch =
            user &&
            user.password &&
            (await bcrypt.compare(password, user.password));

        if (isMatch) {
            return user;
        }

        throw new UnprocessableEntityException(
            'email_password_incorrectly',
            'Email or password incorrectly',
        );
    }

    async updateMe(user: UserPayload, updateMeDto: UpdateMeDto) {
        await this.updateOne(
            { _id: user._id },
            {
                ...updateMeDto,
            },
        );

        const result = await this.getMe(user);
        return result;
    }

    async getMe(user: UserPayload) {
        return await this.findOne({
            _id: user._id,
        })
            .select({ password: 0 })
            .exec();
    }

    async getMeForFront(user: UserPayload) {
        const { _id } = user;
        const result = await this.findOne({
            _id: _id,
        })
            .select({ password: 0 })
            .exec();

        const amountRewardUserForApp =
            await this.metadataService.getAmountRewardUserForApp(
                MetadataType.AMOUNT_REWARD_USER_GLOBAL,
            );

        const countReceivedReward =
            await this.userTransactionService.checkLimitReceivedReward(_id, [
                MetadataType.AMOUNT_REWARD_USER_OPEN_APP,
                MetadataType.AMOUNT_REWARD_USER_SHARE_APP,
                MetadataType.AMOUNT_REWARD_USER_COMMENT_APP,
            ]);

        const referral = await this.userReferralsService
            .find({ code: result.inviteCode })
            .exec();
        const introducer = await this.userReferralsService
            .findOne({
                telegramUserId: result.telegramUserId,
            })
            .exec();

        return {
            ...result,
            introducer: introducer?.code,
            referral,
            countReceivedReward,
            limitReceivedReward: amountRewardUserForApp.value.limit,
        };
    }

    async deletes(_ids: Types.ObjectId[], user: UserPayload) {
        const { _id: userId } = user;
        const data = await this.find({ _id: { $in: _ids } }).exec();
        await this.updateMany(
            { _id: { $in: _ids } },
            { deletedAt: new Date(), deletedBy: userId },
        );

        await this.addCacheBannedUser(_ids);

        return data;
    }

    async ban(_ids: Types.ObjectId[], user: UserPayload) {
        await this.updateMany(
            { _id: { $in: _ids } },
            { status: UserStatus.INACTIVE, updatedBy: user._id },
        );

        await this.addCacheBannedUser(_ids);

        return _ids;
    }

    async unBan(_ids: Types.ObjectId[], user: UserPayload) {
        await this.updateMany(
            { _id: { $in: _ids } },
            { status: UserStatus.ACTIVE, updatedBy: user._id },
        );

        await this.removeCacheBannedUser(_ids);

        return _ids;
    }

    private async checkLimitReceivedRewardForDay(userId: Types.ObjectId) {
        const amountRewardUserForApp =
            await this.metadataService.getAmountRewardUserForApp(
                MetadataType.AMOUNT_REWARD_USER_GLOBAL,
            );

        const countReceivedReward =
            await this.userTransactionService.checkLimitReceivedReward(userId, [
                MetadataType.AMOUNT_REWARD_USER_OPEN_APP,
                MetadataType.AMOUNT_REWARD_USER_SHARE_APP,
                MetadataType.AMOUNT_REWARD_USER_COMMENT_APP,
            ]);

        const { limit, reward } = amountRewardUserForApp.value;

        if (countReceivedReward >= limit) {
            this.websocketGateway.sendLimitAddPointForUser(userId, {
                overLimitReceivedRewardForDay: true,
                limitReward: limit * reward,
            });

            this.eventEmitter.emit(NOTIFICATION_EVENT_HANDLER.CREATE, {
                name: `You've earned`,
                userId: new Types.ObjectId(userId),
                refId: new Types.ObjectId(amountRewardUserForApp['_id']),
                shortDescription: `You ${limit * reward} today - max reached!`,
                refSource: COLLECTION_NAMES.APP,
            } as CreateNotificationModel);
        }
    }

    private async hashPassword(password: string) {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    private async addCacheBannedUser(_ids: Types.ObjectId[]) {
        const id = _ids.map((id) => id.toString());
        const usersBannedInCache = await this.superCacheService.get<{
            items: any[];
        }>(UserCacheKey.USER_BANNED);

        if (usersBannedInCache) {
            usersBannedInCache.items.push(
                ..._.difference(id, usersBannedInCache.items),
            );

            await this.superCacheService.set(
                UserCacheKey.USER_BANNED,
                usersBannedInCache,
            );
        }

        if (!usersBannedInCache) {
            await this.superCacheService.set(UserCacheKey.USER_BANNED, {
                items: id,
            });
        }
    }

    private async removeCacheBannedUser(_ids: Types.ObjectId[]) {
        const id = _ids.map((id) => id.toString());
        const usersBannedInCache = await this.superCacheService.get<{
            items: any[];
        }>(UserCacheKey.USER_BANNED);

        if (usersBannedInCache) {
            usersBannedInCache.items = _.difference(
                usersBannedInCache.items,
                id,
            );

            await this.superCacheService.set(UserCacheKey.USER_BANNED, {
                items: usersBannedInCache.items,
            });
        }
    }

    private async addInviteCodeForUser() {
        const users = await this.find({
            inviteCode: { $exists: false },
        }).exec();

        users.forEach(async (user) => {
            await this.updateOne(
                { _id: user._id },
                {
                    inviteCode: generateRandomString(16),
                },
            );
        });
    }
}
