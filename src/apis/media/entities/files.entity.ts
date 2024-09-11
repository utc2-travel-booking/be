import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.FILE,
})
export class File extends AggregateRoot {
    @SuperProp({
        type: Types.ObjectId,
        cms: {
            label: 'Index',
            tableShow: true,
            columnPosition: 1,
        },
        default: () => new Types.ObjectId(),
    })
    _id: Types.ObjectId;

    @SuperProp({
        type: String,
        ref: COLLECTION_NAMES.FILE,
        cms: {
            label: 'File Path',
            tableShow: true,
            columnPosition: 2,
        },
    })
    filePath: string;

    @SuperProp({
        type: String,
        cms: {
            label: 'Name',
            tableShow: true,
            columnPosition: 3,
        },
    })
    name: string;

    @SuperProp({
        type: String,
    })
    filename: string;

    @SuperProp({ type: String })
    folder: string;

    @SuperProp({ type: String })
    note: string;

    @SuperProp({ type: String })
    mime: string;

    @SuperProp({ type: Number })
    size: number;

    @SuperProp({ type: String })
    alt: string;
}

export type FileDocument = File & Document;

export const FileSchema = SchemaFactory.createForClass(File);
FileSchema.plugin(autopopulateSoftDelete);
