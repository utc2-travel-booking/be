import _ from 'lodash';
import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { Document, Types } from 'mongoose';
import { AuditStatus } from '../constants';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.AUDIT,
})
export class Audit extends AggregateRoot {
    @Prop({ type: Types.ObjectId })
    refId: Types.ObjectId;

    @Prop({ type: String })
    refSource: string;

    @Prop({ type: String })
    event: string;

    @Prop({ type: Number })
    statusCode: number;

    @Prop({ type: String })
    statusMessage: string;

    @Prop({ type: String, default: AuditStatus.GOOD_REQUEST })
    status: string;

    @Prop({ type: String })
    url: string;

    @Prop({ type: String })
    targetType: string;

    @Prop({ type: String })
    ipAddress: string;

    @Prop({ type: String })
    userAgent: string;

    @Prop({ type: Object, default: {} })
    oldValues: any;

    @Prop({ type: Object, default: {} })
    newValues: any;

    @Prop({ type: Object, default: {} })
    body: any;
}

export type AuditDocument = Audit & Document;
export const AuditSchema = SchemaFactory.createForClass(Audit);
