import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { UserTransactionType } from '../constants';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { AutoPopulate } from '@libs/super-search';
import { App, AppDocument } from 'src/apis/apps/entities/apps.entity';
import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';

class Mission {
    @Prop({
        type: String,
        required: true,
    })
    missionId: string;

    @Prop({
        type: String,
        required: true,
    })
    name: string;

    @Prop({
        type: String,
        required: true,
    })
    description: string;

    @Prop({
        type: Number,
        required: true,
    })
    reward: number;
}

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
        required: false,
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
    app?: AppDocument;

    @SuperProp({
        required: false,
        type: String,
        cms: {
            label: 'Action',
            tableShow: true,
            columnPosition: 6,
        },
    })
    action?: string;

    @Prop({
        required: false,
        type: Mission,
    })
    mission?: Mission;

}

export type UserTransactionDocument = UserTransaction & Document;
export const UserTransactionSchema =
    SchemaFactory.createForClass(UserTransaction);
