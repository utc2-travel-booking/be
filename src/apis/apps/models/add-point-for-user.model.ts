import { Types } from 'mongoose';
import { UserTransactionType } from 'src/apis/user-transaction/constants';

export class AddPointForUserDto {
    point: number;

    type: UserTransactionType;

    description: string;

    app: Types.ObjectId;
}
