import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { App, AppDocument } from 'src/apis/apps/entities/apps.entity';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import { AutoPopulate } from '@libs/super-search';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.REVIEW_RATING,
})
export class ReviewRating extends AggregateRoot {
    @SuperProp({
        type: String,
        cms: {
            label: 'Content',
            tableShow: true,
            columnPosition: 1,
        },
    })
    content: string;

    @SuperProp({
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

    @SuperProp({
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

    @SuperProp({
        type: Date,
        cms: {
            label: 'Created At',
            tableShow: true,
            columnPosition: 4,
        },
        default: () => new Date().toISOString(),
    })
    createdAt: Date;
}

export type ReviewRatingDocument = ReviewRating & Document;
export const ReviewRatingSchema = SchemaFactory.createForClass(ReviewRating);
ReviewRatingSchema.plugin(autopopulateSoftDelete);
