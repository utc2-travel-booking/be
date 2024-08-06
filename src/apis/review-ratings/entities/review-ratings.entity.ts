import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { App, AppDocument } from 'src/apis/apps/entities/apps.entity';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import { AutoPopulate } from 'src/packages/super-search';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.REVIEW_RATING,
})
export class ReviewRating extends AggregateRoot {
    @Prop({ type: String })
    content: string;

    @Prop({ type: Number, min: 0, max: 5 })
    star: number;

    @Prop({ type: Types.ObjectId, relationClass: App })
    @AutoPopulate({
        ref: COLLECTION_NAMES.APP,
    })
    app: AppDocument[];
}

export type ReviewRatingDocument = ReviewRating & Document;
export const ReviewRatingSchema = SchemaFactory.createForClass(ReviewRating);
ReviewRatingSchema.plugin(autopopulateSoftDelete);
