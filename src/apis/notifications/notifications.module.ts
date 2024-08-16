import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { NotificationSchema } from './entities/notifications.entity';
import { WebsocketModule } from 'src/packages/websocket/websocket.module';
import { NotificationEvent } from './event-handlers/notifications.event';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.NOTIFICATION, schema: NotificationSchema },
        ]),
        WebsocketModule,
    ],
    controllers: [],
    providers: [NotificationsService, NotificationEvent],
    exports: [NotificationsService],
})
export class NotificationsModule {}
