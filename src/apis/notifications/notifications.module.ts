import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsService } from './notifications.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { NotificationSchema } from './entities/notifications.entity';
import { RolesModule } from '../roles/roles.module';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.NOTIFICATION, schema: NotificationSchema },
        ]),
        RolesModule,
    ],
    controllers: [],
    providers: [NotificationsService],
    exports: [NotificationsService],
})
export class NotificationsModule {}
