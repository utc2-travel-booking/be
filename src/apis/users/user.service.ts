import {
    BadRequestException,
    forwardRef,
    Inject,
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
import { RolesService } from '../roles/roles.service';
import _ from 'lodash';
import * as bcrypt from 'bcryptjs';
import { UserCacheKey, UserStatus } from './constants';
import { SuperCacheService } from 'src/packages/super-cache/super-cache.service';
import { UserLoginTelegramDto } from '../auth/dto/user-login-telegram.dto';
import { MediaService } from '../media/medias.service';
import { RoleType } from '../roles/constants';
import { ModuleRef } from '@nestjs/core';
import { CreateUserDto } from './dto/create-user.dto';
import { UserTransactionService } from '../user-transaction/user-transaction.service';
import { UserTransactionType } from '../user-transaction/constants';
import { AddPointForUserDto } from '../apps/models/add-point-for-user.model';
import { NotificationsService } from '../notifications/notifications.service';
import { AppDocument } from '../apps/entities/apps.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { MetadataType } from '../metadata/constants';

@Injectable()
export class UserService
    extends BaseService<UserDocument, User>
    implements OnModuleInit
{
    constructor(
        @InjectModel(COLLECTION_NAMES.USER)
        private readonly userModel: Model<UserDocument>,
        private readonly roleService: RolesService,
        private readonly superCacheService: SuperCacheService,
        private readonly mediaService: MediaService,
        moduleRef: ModuleRef,
        private readonly userTransactionService: UserTransactionService,
        @Inject(forwardRef(() => NotificationsService))
        private readonly notificationService: NotificationsService,
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
    }

    async getHistoryReward(user: UserPayload, description: MetadataType) {
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
                description,
            })
            .exec();

        const userTransactionYesterday = await this.userTransactionService
            .find({
                'createdBy._id': user._id,
                createdAt: { $gte: yesterday, $lt: today },
                description,
            })
            .exec();

        const userTransactionLastOneMonth = await this.userTransactionService
            .find({
                'createdBy._id': user._id,
                createdAt: { $gte: lastOneMonth },
                description,
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

    async addPointForUser(
        addPointForUserDto: AddPointForUserDto,
        appDocument: AppDocument,
        userPayload: UserPayload,
    ) {
        const { _id: userId } = userPayload;
        const { point, type, action, app, name, limit } = addPointForUserDto;
        const { name: appName } = appDocument;

        const userTransactionThisApp = await this.userTransactionService
            .findOne({
                'createdBy._id': userId,
                'app._id': app,
                action,
            })
            .exec();

        if (userTransactionThisApp) {
            return await this.getMe(userPayload);
        }

        await this.userTransactionService.checkLimitReceivedReward(
            userId,
            action,
            limit,
        );

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
            action,
        });

        if (userTransaction) {
            await this.updateOne(
                { _id },
                {
                    currentPoint: after,
                },
            );
        }

        await this.notificationService.create({
            name: `+${point}`,
            shortDescription: `You ${name} ${appName}`,
            user: userId,
            refId: app,
            refSource: COLLECTION_NAMES.APP,
        });

        return await this.getMe(userPayload);
    }

    async createUserTelegram(
        userLoginTelegramDto: Partial<UserLoginTelegramDto>,
    ) {
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
            { new: true },
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
}
