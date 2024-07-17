import { Types } from 'mongoose';

export class UserPayload {
    _id: Types.ObjectId;
    name: string;
    email: string;
    roleId: Types.ObjectId;
}
