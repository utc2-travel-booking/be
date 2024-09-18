import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import {
    Notification,
    NotificationDocument,
} from './entities/notifications.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, Types } from 'mongoose';
import { ModuleRef } from '@nestjs/core';
import { ExtendedPagingDto } from 'src/pipes/page-result.dto.pipe';
import { UserPayload } from 'src/base/models/user-payload.model';
import { pagination } from '@libs/super-search';
import { UpdateStatusNotificationDto } from './dto/update-status-notifications.dto';
import { UserNotificationStatus } from './constants';
import { WebsocketGateway } from 'src/packages/websocket/websocket.gateway';
import { EVENT_NAME } from 'src/packages/websocket/constants';
import { CreateNotificationModel } from './models/create-notification.model';
import { parseDescription } from './common/handle-description.util';
import { it } from 'node:test';

@Injectable()
export class NotificationsService extends BaseService<
    NotificationDocument,
    Notification
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.NOTIFICATION)
        private readonly notificationModel: Model<NotificationDocument>,
        moduleRef: ModuleRef,
        private readonly websocketGateway: WebsocketGateway,
    ) {
        super(
            notificationModel,
            Notification,
            COLLECTION_NAMES.NOTIFICATION,
            moduleRef,
        );
    }

    async countNotificationUnreadOfUser(userId: Types.ObjectId) {
        return this.countDocuments({
            user: userId,
            status: UserNotificationStatus.UNREAD,
        })
            .autoPopulate(false)
            .exec();
    }

    async getNotificationsOfUser(
        queryParams: ExtendedPagingDto,
        user: UserPayload,
    ) {
        const {
            page,
            limit,
            sortBy,
            sortDirection,
            skip,
            filterPipeline,
            select,
        } = queryParams;
        const { _id } = user;

        const resultPromise = this.find(
            {
                'user._id': _id,
                status: { $ne: UserNotificationStatus.DELETED },
            },
            filterPipeline,
        )
            .sort({ [sortBy]: sortDirection })
            .skip(skip)
            .limit(limit)
            .select(select)
            .exec();

        const totalPromise = this.countDocuments({
            'user._id': _id,
            ...filterPipeline,
        }).exec();

        const [result, total] = await Promise.all([
            resultPromise,
            totalPromise,
        ]);

        const handleResult = await Promise.all(
            result.map(async (item) => {
                const updateItem = {
                    ...item,
                    shortDescription: parseDescription(item.shortDescription),
                };
                return updateItem;
            }),
        );

        const meta = pagination(handleResult, page, limit, total);

        return { items: handleResult, meta };
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

        await this.sendSocketCountNotificationUnread(_id);
    }

    async deleteNotificationOfUser(_id: Types.ObjectId, user: UserPayload) {
        const { _id: userId } = user;

        const result = await this.findOneAndUpdate(
            { _id, user: userId },
            { status: UserNotificationStatus.DELETED },
        );

        await this.sendSocketCountNotificationUnread(userId);

        return result;
    }

    async updateAllStatus(user: UserPayload) {
        const { _id } = user;

        await this.updateMany(
            { user: _id },
            { status: UserNotificationStatus.READ },
        );

        await this.sendSocketCountNotificationUnread(_id);
    }

    async createNotification(createNotificationModel: CreateNotificationModel) {
        const { name, userId, refId, shortDescription, refSource } =
            createNotificationModel;

        const newNotification = await this.create({
            name,
            shortDescription,
            user: userId,
            refId,
            refSource,
        });

        if (newNotification) {
            await this.sendSocketCountNotificationUnread(userId);

            const notification = await this.findOne({
                _id: newNotification._id,
            }).exec();

            this.websocketGateway.sendToClient(
                userId,
                EVENT_NAME.NEW_NOTIFICATION,
                notification,
            );
        }
    }

    private async sendSocketCountNotificationUnread(userId: Types.ObjectId) {
        const countNotificationUnreadOfUser =
            await this.countNotificationUnreadOfUser(userId);

        this.websocketGateway.sendToClient(
            userId,
            EVENT_NAME.COUNT_NOTIFICATION_UNREAD,
            countNotificationUnreadOfUser,
        );
    }
}
