import _ from 'lodash';
import { SchemaFactory, Schema } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { Document, Types } from 'mongoose';
import { AuditStatus } from '../constants';
import { ExtendedProp } from '@libs/super-core/decorators/extended-prop.decorator';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.AUDIT,
})
export class Audit extends AggregateRoot {
    @ExtendedProp({
        type: String,
        cms: {
            label: 'Event',
            tableShow: true,
            index: true,
            columnPosition: 1,
        },
    })
    event: string;

    @ExtendedProp({
        type: String,
        cms: {
            label: 'URL',
            tableShow: true,
            columnPosition: 2,
        },
    })
    url: string;

    @ExtendedProp({
        type: String,
        cms: {
            label: 'Ref Source',
            tableShow: true,
            columnPosition: 3,
        },
    })
    refSource: string;

    @ExtendedProp({
        type: Types.ObjectId,
        cms: {
            label: 'Ref ID',
            tableShow: true,
            columnPosition: 4,
        },
    })
    refId: Types.ObjectId;

    @ExtendedProp({
        type: Number,
        cms: {
            label: 'Status Code',
            tableShow: true,
            columnPosition: 5,
        },
    })
    statusCode: number;

    @ExtendedProp({
        type: String,
        cms: {
            label: 'Status Message',
            tableShow: true,
            columnPosition: 6,
        },
    })
    statusMessage: string;

    @ExtendedProp({
        type: String,
        cms: {
            label: 'IP Address',
            tableShow: true,
            columnPosition: 7,
        },
    })
    ipAddress: string;

    @ExtendedProp({
        type: String,
        cms: {
            label: 'User Agent',
            tableShow: true,
            columnPosition: 8,
        },
    })
    userAgent: string;

    @ExtendedProp({
        type: String,
        default: AuditStatus.GOOD_REQUEST,
        cms: {
            label: 'Status',
            tableShow: true,
            columnPosition: 9,
        },
    })
    status: string;

    @ExtendedProp({ type: String })
    targetType: string;

    @ExtendedProp({ type: Object, default: {} })
    oldValues: any;

    @ExtendedProp({ type: Object, default: {} })
    newValues: any;

    @ExtendedProp({ type: Object, default: {} })
    body: any;
}

export type AuditDocument = Audit & Document;
export const AuditSchema = SchemaFactory.createForClass(Audit);
