import { ExtendedProp } from '@libs/super-core/decorators/extended-prop.decorator';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
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
    @ExtendedProp({
        type: Types.ObjectId,
        cms: {
            label: 'Index',
            tableShow: true,
            columnPosition: 1,
        },
    })
    _id: Types.ObjectId;

    @ExtendedProp({
        type: String,
        ref: COLLECTION_NAMES.FILE,
        cms: {
            label: 'File Path',
            tableShow: true,
            columnPosition: 2,
        },
    })
    filePath: string;

    @ExtendedProp({
        type: String,
        cms: {
            label: 'Name',
            tableShow: true,
            columnPosition: 3,
        },
    })
    name: string;

    @ExtendedProp({
        type: String,
    })
    filename: string;

    @ExtendedProp({ type: String })
    folder: string;

    @ExtendedProp({ type: String })
    note: string;

    @ExtendedProp({ type: String })
    mime: string;

    @ExtendedProp({ type: Number })
    size: number;

    @ExtendedProp({ type: String })
    alt: string;
}

export type FileDocument = File & Document;

export const FileSchema = SchemaFactory.createForClass(File);
FileSchema.plugin(autopopulateSoftDelete);
