import { Types } from 'mongoose';
import { UserTransactionType } from 'src/apis/user-transaction/constants';

export class AddPointForUserDto {
    point: number;

    type: UserTransactionType;

    action: string[];

    app: Types.ObjectId;

    name: string;

    limit: number;
}
export class AddPointMissionDto {
    missionId: string;

    name: string;

    description: string;

    reward: number;
}
