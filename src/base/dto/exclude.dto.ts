import { Exclude } from 'class-transformer';
import { Types } from 'mongoose';

export class ExcludeDto {
    @Exclude()
    _id: Types.ObjectId;

    @Exclude()
    createdAt: Date;

    @Exclude()
    updatedAt: Date;

    @Exclude()
    __v: number;

    @Exclude()
    isDeleted: boolean;

    @Exclude()
    createdBy: Types.ObjectId;

    @Exclude()
    updatedBy: Types.ObjectId;

    @Exclude()
    deletedBy: Types.ObjectId;
}
