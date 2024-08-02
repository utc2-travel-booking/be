import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AppDocument } from 'src/apis/apps/entities/apps.entity';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import { AutoPopulate } from 'src/packages/super-search';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.REVIEW,
})
export class Review extends AggregateRoot {
    @Prop({ type: String })
    content: string;

    @Prop({ type: Number, min: 0, max: 5 })
    star: number;

    @Prop({ type: Types.ObjectId })
    @AutoPopulate({
        ref: COLLECTION_NAMES.APP,
    })
    app: AppDocument[];
}

export type ReviewDocument = Review & Document;
export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.plugin(autopopulateSoftDelete);
