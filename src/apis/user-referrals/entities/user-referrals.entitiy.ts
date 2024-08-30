import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User, UserDocument } from 'src/apis/users/entities/user.entity';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import { AutoPopulate } from '@libs/super-search';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.USER_REFERRAL,
})
export class UserReferral extends AggregateRoot {
    @Prop({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.USER,
        refClass: User,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.USER,
    })
    referrer: UserDocument;
}

export type UserReferralDocument = UserReferral & Document;
export const UserReferralSchema = SchemaFactory.createForClass(UserReferral);
UserReferralSchema.plugin(autopopulateSoftDelete);
