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

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.APP,
})
export class App extends AggregateRoot {
    @ExtendedProp({ type: String, required: true, cmsLabel: 'Name' })
    name: string;

    @ExtendedProp({ type: String, cmsLabel: 'Slug' })
    slug: string;

    @ExtendedProp({ type: MultipleLanguageType, cmsLabel: 'Short Description' })
    @MultipleLanguage()
    shortDescription: MultipleLanguageType;

    @ExtendedProp({ type: MultipleLanguageType, cmsLabel: 'Description' })
    @MultipleLanguage()
    caption: MultipleLanguageType;

    @ExtendedProp({ type: String, required: true, cmsLabel: 'URL' })
    url: string;

    @ExtendedProp({
        type: [Types.ObjectId],
        ref: COLLECTION_NAMES.CATEGORIES,
        refClass: Category,
        cmsLabel: 'Categories',
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.CATEGORIES,
        isArray: true,
    })
    categories: CategoryDocument[];

    @ExtendedProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.FILE,
        refClass: File,
        cmsLabel: 'Featured Image',
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
    })
    featuredImage: FileDocument;

    @ExtendedProp({
        type: [Types.ObjectId],
        ref: COLLECTION_NAMES.FILE,
        refClass: File,
        cmsLabel: 'Preview Images',
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
        isArray: true,
    })
    previewImages: FileDocument[];

    @ExtendedProp({ type: Date, default: null, cmsLabel: 'Published Start' })
    publishedStart: Date;

    @ExtendedProp({ type: Date, default: null, cmsLabel: 'Published End' })
    publishedEnd: Date;

    @ExtendedProp({
        type: Number,
        required: false,
        default: 0,
        cmsLabel: 'Total Rating',
    })
    totalRating: number;

    @ExtendedProp({
        type: Number,
        required: false,
        default: 0,
        cmsLabel: 'Total Rating Count',
    })
    totalRatingCount: number;

    @ExtendedProp({
        type: Number,
        required: false,
        default: 0,
        cmsLabel: 'Average Rating',
    })
    avgRating: number;
}

export type AppDocument = App & Document;
export const AppSchema = SchemaFactory.createForClass(App);
AppSchema.plugin(autopopulateSoftDelete);
