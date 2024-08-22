import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import { MetadataType } from '../constants';
import { Document, Types, SchemaTypes } from 'mongoose';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { ExtendedProp } from '@libs/super-core/decorators/extended-prop.decorator';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.METADATA,
})
export class Metadata extends AggregateRoot {
    @ExtendedProp({ required: true })
    type: MetadataType;

    @ExtendedProp({ required: false, type: SchemaTypes.Mixed })
    key: any;

    @ExtendedProp({ required: false, type: SchemaTypes.Mixed })
    value: any;

    @ExtendedProp({ required: false })
    values: string;

    @ExtendedProp({ required: false })
    description: string;

    @ExtendedProp({
        required: false,
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.FILE,
    })
    featuredImage: Types.ObjectId;
}

export type MetadataDocument = Metadata & Document;
export const MetadataSchema = SchemaFactory.createForClass(Metadata);

MetadataSchema.plugin(autopopulateSoftDelete);
