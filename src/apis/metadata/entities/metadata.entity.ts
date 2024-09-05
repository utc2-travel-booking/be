import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import { MetadataType } from '../constants';
import { Document, Types, SchemaTypes } from 'mongoose';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.METADATA,
})
export class Metadata extends AggregateRoot {
    @SuperProp({ required: true })
    type: MetadataType;

    @SuperProp({ required: false, type: SchemaTypes.Mixed })
    key: any;

    @SuperProp({ required: false, type: SchemaTypes.Mixed })
    value: any;

    @SuperProp({ required: false })
    values: string;

    @SuperProp({ required: false })
    description: string;

    @SuperProp({
        required: false,
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.FILE,
    })
    featuredImage: Types.ObjectId;
}

export type MetadataDocument = Metadata & Document;
export const MetadataSchema = SchemaFactory.createForClass(Metadata);

MetadataSchema.plugin(autopopulateSoftDelete);
