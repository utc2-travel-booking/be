import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { UserNotificationStatus } from '../constants';
import { AutoPopulate } from 'src/packages/super-search';
import { FileDocument } from 'src/apis/media/entities/files.entity';
import { UserDocument } from 'src/apis/users/entities/user.entity';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.NOTIFICATION,
})
export class Notification extends AggregateRoot {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String })
    shortDescription: string;

    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAMES.USER, required: true })
    @AutoPopulate({
        ref: COLLECTION_NAMES.USER,
    })
    user: UserDocument;

    @Prop({
        type: String,
        enum: UserNotificationStatus,
        default: UserNotificationStatus.UNREAD,
    })
    status: UserNotificationStatus;

    @Prop({ type: String })
    urlRedirect: string;

    @Prop({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.FILE,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
    })
    featuredImage: FileDocument;

    @Prop({ type: Types.ObjectId })
    refId: Types.ObjectId;

    @Prop({ type: String })
    refSource: string;
}

export type NotificationDocument = Notification & Document;
export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.plugin(autopopulateSoftDelete);
