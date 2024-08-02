import {
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
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCacheKey, UserStatus } from './constants';
import { SuperCacheService } from 'src/packages/super-cache/super-cache.service';
import { UserLoginTelegramProviderDto } from '../auth/dto/user-login-telegram-provider.dto';
import { MediaService } from '../media/medias.service';
import { RoleType } from '../roles/constants';

@Injectable()
export class UserService
    extends BaseService<UserDocument, User>
    implements OnModuleInit
{
    constructor(
        @InjectModel(COLLECTION_NAMES.USER)
        private readonly userModel: Model<UserDocument>,
        private readonly roleService: RolesService,
        eventEmitter: EventEmitter2,
        private readonly superCacheService: SuperCacheService,
        private readonly mediaService: MediaService,
    ) {
        super(userModel, User, COLLECTION_NAMES.USER, eventEmitter);
    }

    async onModuleInit() {
        const usersBanned = await this.find({
            filter: { status: UserStatus.INACTIVE },
        });
        const usersDeleted = await this.find({
            filter: { deletedAt: { $ne: null } },
        });

        if (usersBanned.length) {
            const ids = usersBanned.map((user) => user._id);

            await this.addCacheBannedUser(ids);
        }

        if (usersDeleted.length) {
            const ids = usersDeleted.map((user) => user._id);

            await this.addCacheBannedUser(ids);
        }
    }

    async createUserTelegramProvider(
        userLoginTelegramProviderDto: Partial<UserLoginTelegramProviderDto>,
    ) {
        const { id, firstName, lastName, username, photoUrl } =
            userLoginTelegramProviderDto;

        const user = await this.findOne({ 'telegram.id': id });

        if (user) {
            return user;
        }

        let avatar = null;
        if (photoUrl) {
            avatar = await this.mediaService.create({
                filename: `avatar-${id}`,
                filePath: photoUrl,
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

    async validateUserLocal(email: string, password: string) {
        if (!email || !password) {
            throw new UnprocessableEntityException(
                'email_password_incorrectly',
                'Email or password incorrectly',
            );
        }

        const user = await this.findOne({ filter: { email } });

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

    async updateMe(
        user: UserPayload,
        updateMeDto: UpdateMeDto,
        locale: string,
    ) {
        await this.updateOne(
            { _id: user._id },
            {
                ...updateMeDto,
            },
        );

        const result = await this.getMe(user, locale);
        return result;
    }

    async getMe(user: UserPayload, locale: string) {
        return await this.findOne({
            filter: { _id: user._id },
            projection: '-password',
            locale,
        });
    }

    async deletes(_ids: Types.ObjectId[], user: UserPayload) {
        const { _id: userId } = user;
        const data = await this.find({ filter: { _id: { $in: _ids } } });
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
