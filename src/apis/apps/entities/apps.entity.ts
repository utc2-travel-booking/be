import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import {
    Category,
    CategoryDocument,
} from 'src/apis/categories/entities/categories.entity';
import { File, FileDocument } from 'src/apis/media/entities/files.entity';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import {
    MultipleLanguage,
    MultipleLanguageType,
} from '@libs/super-multiple-language';
import { AutoPopulate } from '@libs/super-search';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { ExtendedProp } from '@libs/super-core/decorators/extended-prop.decorator';

export enum SubmitStatus {
    Pending = 'Pending',
    Approved = 'Approved',
    Rejected = 'Rejected',
}

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.APP,
})
export class App extends AggregateRoot {
    @ExtendedProp({
        type: String,
        required: true,
        cms: {
            label: 'Name',
            tableShow: true,
            index: true,
            columnPosition: 1,
        },
    })
    name: string;

    @ExtendedProp({
        type: String,
        cms: {
            label: 'Slug',
            tableShow: true,
            columnPosition: 2,
        },
    })
    slug: string;

    @ExtendedProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.FILE,
        refClass: File,
        cms: {
            label: 'Featured Image',
            tableShow: true,
            columnPosition: 3,
        },
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
    })
    featuredImage: FileDocument;

    @ExtendedProp({
        type: String,
        required: true,
        cms: {
            label: 'Url',
            tableShow: true,
            columnPosition: 4,
        },
    })
    url: string;

    @ExtendedProp({
        type: MultipleLanguageType,
        cms: {
            label: 'Short Description',
            tableShow: true,
            columnPosition: 5,
        },
    })
    @MultipleLanguage()
    shortDescription: MultipleLanguageType;

    @ExtendedProp({
        type: MultipleLanguageType,
        cms: {
            label: 'Description',
            tableShow: true,
            columnPosition: 6,
        },
    })
    @MultipleLanguage()
    caption: MultipleLanguageType;

    @ExtendedProp({
        type: [Types.ObjectId],
        ref: COLLECTION_NAMES.CATEGORIES,
        refClass: Category,
        cms: {
            label: 'Categories',
            tableShow: true,
            columnPosition: 7,
        },
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.CATEGORIES,
        isArray: true,
    })
    categories: CategoryDocument[];

    @ExtendedProp({
        type: [Types.ObjectId],
        ref: COLLECTION_NAMES.FILE,
        refClass: File,
        cms: {
            label: 'Preview Images',
        },
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
        isArray: true,
    })
    previewImages: FileDocument[];

    @ExtendedProp({
        type: Date,
        default: null,
        cms: {
            label: 'Published Start',
        },
    })
    publishedStart: Date;

    @ExtendedProp({
        type: Date,
        default: null,
        cms: { label: 'Published End' },
    })
    publishedEnd: Date;

    @ExtendedProp({
        type: Number,
        required: false,
        default: 0,
        cms: {
            label: 'Total Rating Count',
            tableShow: true,
            columnPosition: 8,
        },
    })
    totalRatingCount: number;

    @ExtendedProp({
        type: Number,
        required: false,
        default: 0,
        cms: {
            label: 'Average Rating',
            tableShow: true,
            columnPosition: 9,
        },
    })
    avgRating: number;

    @ExtendedProp({
        type: Number,
        required: false,
        default: 0,
        cms: {
            label: 'Total Rating',
            tableShow: true,
            columnPosition: 10,
        },
    })
    totalRating: number;

    @ExtendedProp({
        required: true,
        default: SubmitStatus.Approved,
        enum: SubmitStatus,
    })
    status: SubmitStatus;
}

export type AppDocument = App & Document;
export const AppSchema = SchemaFactory.createForClass(App);
AppSchema.plugin(autopopulateSoftDelete);
