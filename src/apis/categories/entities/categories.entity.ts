import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import { CategoryType } from '../constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import {
    MultipleLanguage,
    MultipleLanguageType,
} from 'src/packages/super-multiple-language';
import { AutoPopulate } from 'src/packages/super-search';
import { File } from 'src/apis/media/entities/files.entity';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.CATEGORIES,
})
export class Category extends AggregateRoot {
    @Prop({ type: MultipleLanguageType, required: true })
    @MultipleLanguage()
    name: MultipleLanguageType;

    @Prop({ type: String, required: true, unique: true })
    slug: string;

    @Prop({ type: MultipleLanguageType })
    @MultipleLanguage()
    shortDescription: MultipleLanguageType;

    @Prop({ type: Number, default: 0 })
    position: number;

    @Prop({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.CATEGORIES,
    })
    parent: Category;

    @Prop({ type: String, enum: CategoryType })
    type: CategoryType;

    @Prop({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.FILE,
        refClass: File,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
    })
    featuredImage: File;
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.plugin(autopopulateSoftDelete);
