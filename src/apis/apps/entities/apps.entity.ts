import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
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

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.APP,
})
export class App extends AggregateRoot {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String })
    slug: string;

    @Prop({ type: MultipleLanguageType })
    @MultipleLanguage()
    shortDescription: MultipleLanguageType;

    @Prop({ type: MultipleLanguageType })
    @MultipleLanguage()
    caption: MultipleLanguageType;

    @Prop({ type: String, required: true })
    url: string;

    @Prop({
        type: [Types.ObjectId],
        ref: COLLECTION_NAMES.CATEGORIES,
        refClass: Category,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.CATEGORIES,
        isArray: true,
    })
    categories: CategoryDocument[];

    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAMES.FILE, refClass: File })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
    })
    featuredImage: FileDocument;

    @Prop({
        type: [Types.ObjectId],
        ref: COLLECTION_NAMES.FILE,
        refClass: File,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
        isArray: true,
    })
    previewImages: FileDocument[];

    @Prop({ type: Date, default: null })
    publishedStart: Date;

    @Prop({ type: Date, default: null })
    publishedEnd: Date;

    @Prop({
        type: Number,
        required: false,
        default: 0,
    })
    totalRating: number;

    @Prop({
        type: Number,
        required: false,
        default: 0,
    })
    totalRatingCount: number;

    @Prop({
        type: Number,
        required: false,
        default: 0,
    })
    avgRating: number;
}

export type AppDocument = App & Document;
export const AppSchema = SchemaFactory.createForClass(App);
AppSchema.plugin(autopopulateSoftDelete);
