import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import { MetadataType } from '../constants';
import { Document, Types, SchemaTypes } from 'mongoose';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.METADATA,
})
export class Metadata extends AggregateRoot {
    @Prop({ required: true, enum: MetadataType })
    type: MetadataType;

    @Prop({ required: false, type: SchemaTypes.Mixed })
    key: any;

    @Prop({ required: false, type: SchemaTypes.Mixed })
    value: any;

    @Prop({ required: false })
    values: string;

    @Prop({ required: false })
    description: string;

    @Prop({ required: false, type: Types.ObjectId, ref: COLLECTION_NAMES.FILE })
    featuredImage: Types.ObjectId;
}

export type MetadataDocument = Metadata & Document;
export const MetadataSchema = SchemaFactory.createForClass(Metadata);

MetadataSchema.plugin(autopopulateSoftDelete);
