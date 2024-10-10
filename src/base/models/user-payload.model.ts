import { Types } from 'mongoose';

export class UserPayload {
    _id: Types.ObjectId;
    name: string;
    roleId: Types.ObjectId;
    email?: string;
}
