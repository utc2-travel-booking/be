import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import _ from 'lodash';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.FILE,
})
export class File extends AggregateRoot {
    @Prop({
        type: Types.ObjectId,
        cms: {
            label: 'Index',
            tableShow: true,
            columnPosition: 1,
        },
    })
    _id: Types.ObjectId;

    @Prop({
        type: String,
        ref: COLLECTION_NAMES.FILE,
        cms: {
            label: 'File Path',
            tableShow: true,
            columnPosition: 2,
        },
    })
    filePath: string;

    @Prop({
        type: String,
        cms: {
            label: 'Name',
            tableShow: true,
            columnPosition: 3,
        },
    })
    name: string;

    @Prop({
        type: String,
    })
    filename: string;

    @Prop({ type: String })
    folder: string;

    @Prop({ type: String })
    note: string;

    @Prop({ type: String })
    mime: string;

    @Prop({ type: Number })
    size: number;

    @Prop({ type: String })
    alt: string;
}

export type FileDocument = File & Document;

export const FileSchema = SchemaFactory.createForClass(File);
FileSchema.plugin(autopopulateSoftDelete);
