import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';
import { ReferralStatus } from '../constants';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.USER_REFERRAL,
})
export class UserReferral extends AggregateRoot {
    @SuperProp({
        type: Number,
        required: true,
    })
    telegramUserId: number;

    @SuperProp({
        type: String,
        required: true,
    })
    code: string;

    @SuperProp({
        type: String,
        enum: ReferralStatus,
        default: ReferralStatus.PENDING,
    })
    status: ReferralStatus;
}

export type UserReferralDocument = UserReferral & Document;
export const UserReferralSchema = SchemaFactory.createForClass(UserReferral);
UserReferralSchema.plugin(autopopulateSoftDelete);
