import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications.service';
import { NOTIFICATION_EVENT_HANDLER } from '../constants';
import { CreateNotificationModel } from '../models/create-notification.model';

@Injectable()
export class NotificationEvent {
    constructor(private readonly notificationsService: NotificationsService) {}

    @OnEvent(NOTIFICATION_EVENT_HANDLER.CREATE)
    async handleNotificationCreatedEvent(
        createNotificationModel: CreateNotificationModel,
    ) {
        await this.notificationsService.createNotification(
            createNotificationModel,
        );
    }
}
