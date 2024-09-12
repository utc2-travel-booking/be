import { SchemaFactory, Schema } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { Document, Types } from 'mongoose';
import { AuditStatus } from '../constants';
import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';
import { User } from 'src/apis/users/entities/user.entity';
import { AutoPopulate } from '@libs/super-search';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.AUDIT,
})
export class Audit extends AggregateRoot {
    @SuperProp({
        type: String,
        cms: {
            label: 'Event',
            tableShow: true,
            index: true,
            columnPosition: 1,
        },
    })
    event: string;

    @SuperProp({
        type: String,
        cms: {
            label: 'URL',
            tableShow: true,
            columnPosition: 2,
        },
    })
    url: string;

    @SuperProp({
        type: String,
        cms: {
            label: 'Ref Source',
            tableShow: true,
            columnPosition: 3,
        },
    })
    refSource: string;

    @SuperProp({
        type: Types.ObjectId,
        cms: {
            label: 'Ref ID',
            tableShow: true,
            columnPosition: 4,
        },
    })
    refId: Types.ObjectId;

    @SuperProp({
        type: Number,
        cms: {
            label: 'Status Code',
            tableShow: true,
            columnPosition: 5,
        },
    })
    statusCode: number;

    @SuperProp({
        type: String,
        cms: {
            label: 'Status Message',
            tableShow: true,
            columnPosition: 6,
        },
    })
    statusMessage: string;

    @SuperProp({
        type: String,
        cms: {
            label: 'IP Address',
            tableShow: true,
            columnPosition: 7,
        },
    })
    ipAddress: string;

    @SuperProp({
        type: String,
        cms: {
            label: 'User Agent',
            tableShow: true,
            columnPosition: 8,
        },
    })
    userAgent: string;

    @SuperProp({
        type: String,
        default: AuditStatus.GOOD_REQUEST,
        cms: {
            label: 'Status',
            tableShow: true,
            columnPosition: 9,
        },
    })
    status: string;

    @SuperProp({ type: String })
    targetType: string;

    @SuperProp({ type: Object, default: {} })
    oldValues: any;

    @SuperProp({ type: Object, default: {} })
    newValues: any;

    @SuperProp({ type: Object, default: {} })
    body: any;

    @SuperProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.USER,
        refClass: User,
        cms: {
            label: 'Created By',
            tableShow: true,
            columnPosition: 99,
        },
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.USER,
    })
    createdBy: Types.ObjectId;
}

export type AuditDocument = Audit & Document;
export const AuditSchema = SchemaFactory.createForClass(Audit);
