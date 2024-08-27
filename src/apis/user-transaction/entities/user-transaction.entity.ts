import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { UserTransactionType } from '../constants';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { AutoPopulate } from '@libs/super-search';
import { App, AppDocument } from 'src/apis/apps/entities/apps.entity';
import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.USER_TRANSACTION,
})
export class UserTransaction extends AggregateRoot {
    @SuperProp({
        type: String,
        cms: {
            label: 'Type',
            tableShow: true,
            columnPosition: 1,
        },
    })
    type: UserTransactionType;

    @SuperProp({
        type: Number,
        required: true,
        cms: {
            label: 'Amount',
            tableShow: true,
            columnPosition: 2,
        },
    })
    amount: number;

    @SuperProp({
        type: Number,
        required: true,
        cms: {
            label: 'Before Amount',
            tableShow: true,
            columnPosition: 3,
        },
    })
    before: number;

    @SuperProp({
        type: Number,
        required: true,
        cms: {
            label: 'After Amount',
            tableShow: true,
            columnPosition: 4,
        },
    })
    after: number;

    @SuperProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.APP,
        refClass: App,
        cms: {
            label: 'App',
            tableShow: true,
            columnPosition: 5,
        },
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.APP,
    })
    app: AppDocument;

    @SuperProp({
        type: String,
        cms: {
            label: 'Action',
            tableShow: true,
            columnPosition: 6,
        },
    })
    action: string;
}

export type UserTransactionDocument = UserTransaction & Document;
export const UserTransactionSchema =
    SchemaFactory.createForClass(UserTransaction);
