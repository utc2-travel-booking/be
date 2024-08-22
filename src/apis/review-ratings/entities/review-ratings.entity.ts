import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { App, AppDocument } from 'src/apis/apps/entities/apps.entity';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import { AutoPopulate } from '@libs/super-search';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { ExtendedProp } from '@libs/super-core/decorators/extended-prop.decorator';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.REVIEW_RATING,
})
export class ReviewRating extends AggregateRoot {
    @ExtendedProp({
        type: String,
        cms: {
            label: 'Content',
            tableShow: true,
            columnPosition: 1,
        },
    })
    content: string;

    @ExtendedProp({
        type: Number,
        min: 0,
        max: 5,
        cms: {
            label: 'Star',
            tableShow: true,
            columnPosition: 2,
        },
    })
    star: number;

    @ExtendedProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.APP,
        relationClass: App,
        cms: {
            label: 'App',
            tableShow: true,
            columnPosition: 3,
        },
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.APP,
    })
    app: AppDocument;

    @ExtendedProp({
        type: Date,
        cms: {
            label: 'Created At',
            tableShow: true,
            columnPosition: 4,
        },
    })
    createdAt: Date;
}

export type ReviewRatingDocument = ReviewRating & Document;
export const ReviewRatingSchema = SchemaFactory.createForClass(ReviewRating);
ReviewRatingSchema.plugin(autopopulateSoftDelete);
