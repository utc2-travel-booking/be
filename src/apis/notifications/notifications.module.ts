import { NotificationsService } from './notifications.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import {
    Notification,
    NotificationSchema,
} from './entities/notifications.entity';
import { WebsocketModule } from 'src/packages/websocket/websocket.module';
import { NotificationEvent } from './event-handlers/notifications.event';
import { ExtendedMongooseModule } from '@libs/super-core/modules/mongoose/extended-mongoose.module';

@Module({
    imports: [
        ExtendedMongooseModule.forFeature([
            {
                name: COLLECTION_NAMES.NOTIFICATION,
                schema: NotificationSchema,
                entity: Notification,
            },
        ]),
        WebsocketModule,
    ],
    controllers: [],
    providers: [NotificationsService, NotificationEvent],
    exports: [NotificationsService],
})
export class NotificationsModule {}
