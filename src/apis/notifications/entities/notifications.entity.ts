import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { UserNotificationStatus } from '../constants';
import { AutoPopulate } from '@libs/super-search';
import { FileDocument } from 'src/apis/media/entities/files.entity';
import { UserDocument } from 'src/apis/users/entities/user.entity';
import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.NOTIFICATION,
})
export class Notification extends AggregateRoot {
    @SuperProp({
        type: String,
        required: true,
        cms: {
            label: 'Name',
            tableShow: true,
            columnPosition: 1,
        },
    })
    name: string;

    @SuperProp({
        type: String,
        cms: {
            label: 'Short Description',
            tableShow: true,
            columnPosition: 2,
        },
    })
    shortDescription: string;

    @SuperProp({
        type: String,
        enum: UserNotificationStatus,
        default: UserNotificationStatus.UNREAD,
        cms: {
            label: 'Status',
            tableShow: true,
            columnPosition: 3,
        },
    })
    status: UserNotificationStatus;

    @SuperProp({
        type: Types.ObjectId,
        cms: {
            label: 'Ref Id',
            tableShow: true,
            columnPosition: 4,
        },
    })
    refId: Types.ObjectId;

    @SuperProp({
        type: String,
        cms: {
            label: 'Ref Source',
            tableShow: true,
            columnPosition: 5,
        },
    })
    refSource: string;

    @SuperProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.USER,
        required: true,
        cms: {
            label: 'User',
            tableShow: true,
            columnPosition: 6,
        },
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.USER,
    })
    user: UserDocument;

    @SuperProp({ type: String })
    urlRedirect: string;

    @SuperProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.FILE,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
    })
    featuredImage: FileDocument;

    @SuperProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.USER,
        cms: {
            label: 'Created By',
        },
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.USER,
    })
    createdBy: Types.ObjectId;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.plugin(autopopulateSoftDelete);
