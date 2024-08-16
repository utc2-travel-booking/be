import { Types } from 'mongoose';

export class CreateNotificationModel {
    name: string;
    userId: Types.ObjectId;
    refId: Types.ObjectId;
    shortDescription: string;
    refSource: string;
}
