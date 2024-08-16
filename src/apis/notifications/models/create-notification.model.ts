import { Types } from 'mongoose';

export class CreateNotificationModel {
    point: number;
    userId: Types.ObjectId;
    app: Types.ObjectId;
    name: string;
    appName: string;
}
