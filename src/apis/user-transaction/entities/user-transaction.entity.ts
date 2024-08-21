import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { UserTransactionType } from '../constants';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { AutoPopulate } from 'libs/super-search';
import { App, AppDocument } from 'src/apis/apps/entities/apps.entity';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.USER_TRANSACTION,
})
export class UserTransaction extends AggregateRoot {
    @Prop({ type: String })
    type: UserTransactionType;

    @Prop({
        type: Number,
        required: true,
    })
    amount: number;

    @Prop({
        type: Number,
        required: true,
    })
    before: number;

    @Prop({
        type: Number,
        required: true,
    })
    after: number;

    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAMES.APP, refClass: App })
    @AutoPopulate({
        ref: COLLECTION_NAMES.APP,
    })
    app: AppDocument;

    @Prop({ type: String })
    action: string;
}

export type UserTransactionDocument = UserTransaction & Document;
export const UserTransactionSchema =
    SchemaFactory.createForClass(UserTransaction);
