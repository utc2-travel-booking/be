import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import {
    Notification,
    NotificationDocument,
} from './entities/notifications.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, Types } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RolesService } from '../roles/roles.service';
import { ModuleRef } from '@nestjs/core';
import { ExtendedPagingDto } from 'src/pipes/page-result.dto.pipe';
import { UserPayload } from 'src/base/models/user-payload.model';
import { pagination } from 'src/packages/super-search';
import { UpdateStatusNotificationDto } from './dto/update-status-notifications.dto';
import { UserNotificationStatus } from './constants';

@Injectable()
export class NotificationsService extends BaseService<
    NotificationDocument,
    Notification
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.NOTIFICATION)
        private readonly notificationModel: Model<NotificationDocument>,
        moduleRef: ModuleRef,
        private readonly eventEmitter: EventEmitter2,
        private readonly roleService: RolesService,
    ) {
        super(
            notificationModel,
            Notification,
            COLLECTION_NAMES.NOTIFICATION,
            moduleRef,
        );
    }

    async countNotificationUnreadOfUser(userPayload: UserPayload) {
        const { _id } = userPayload;

        return this.countDocuments({
            'user._id': _id,
            status: UserNotificationStatus.UNREAD,
        }).exec();
    }

    async getNotificationsOfUser(
        queryParams: ExtendedPagingDto,
        user: UserPayload,
    ) {
        const { page, limit, sortBy, sortDirection, skip, filterPipeline } =
            queryParams;
        const { _id } = user;

        const result = this.find(
            {
                'user._id': _id,
                status: { $ne: UserNotificationStatus.DELETED },
            },
            filterPipeline,
        )
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(limit)
            .exec();

        const total = this.countDocuments(
            {
                'user._id': _id,
            },
            filterPipeline,
        ).exec();

        return Promise.all([result, total]).then(([items, total]) => {
            const meta = pagination(items, page, limit, total);
            return { items, meta };
        });
    }

    async updateNotificationsStatus(
        updateStatusNotificationDto: UpdateStatusNotificationDto,
        userPayload: UserPayload,
    ) {
        const { notifications } = updateStatusNotificationDto;
        const { _id } = userPayload;

        await this.updateMany(
            { _id: { $in: notifications }, user: _id },
            { status: UserNotificationStatus.READ },
        );
    }

    async deleteNotificationOfUser(_id: Types.ObjectId, user: UserPayload) {
        const { _id: userId } = user;

        const result = await this.findOneAndUpdate(
            { _id, user: userId },
            { status: UserNotificationStatus.DELETED },
        );
        return result;
    }

    async updateAllStatus(user: UserPayload) {
        const { _id } = user;

        await this.updateMany(
            { user: _id },
            { status: UserNotificationStatus.READ },
        );
    }
}
