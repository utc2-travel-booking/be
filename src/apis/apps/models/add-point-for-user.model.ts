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

export type AddPointMissionDto = {
    _id: string;
    name: string;
    description: string;
    reward: number;
    startDate: string;
    endDate: string;
    type: EMissionType;
    progress: number;
    createdAt: string;
    updatedAt: string;
    link?: string;
    group?: string;
};
export enum EMissionType {
    JOIN_TELEGRAM = 'JoinTelegramGoupMission',
    OPEN_LINK = 'OpenLinkMission',
    Default = 'DefaultMission',
    Daily = 'DailyMission',
}
