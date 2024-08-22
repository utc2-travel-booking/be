import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import { CategoryType } from '../constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import {
    MultipleLanguage,
    MultipleLanguageType,
} from '@libs/super-multiple-language';
import { AutoPopulate } from '@libs/super-search';
import { File } from 'src/apis/media/entities/files.entity';
import { ExtendedProp } from '@libs/super-core/decorators/extended-prop.decorator';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.CATEGORIES,
})
export class Category extends AggregateRoot {
    @ExtendedProp({
        type: MultipleLanguageType,
        required: true,
        cms: {
            label: 'Name',
            tableShow: true,
            index: true,
            columnPosition: 1,
        },
    })
    @MultipleLanguage()
    name: MultipleLanguageType;

    @ExtendedProp({
        type: String,
        required: true,
        cms: {
            label: 'Slug',
            tableShow: true,
            columnPosition: 2,
        },
    })
    slug: string;

    @ExtendedProp({
        type: Number,
        default: 0,
        cms: {
            label: 'Position',
            tableShow: true,
            columnPosition: 3,
        },
    })
    position: number;

    @ExtendedProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.FILE,
        refClass: File,
        cms: {
            label: 'Featured Image',
            tableShow: true,
            columnPosition: 4,
        },
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
    })
    featuredImage: File;

    @ExtendedProp({
        type: String,
        enum: CategoryType,
        cms: {
            label: 'Type',
            tableShow: true,
            columnPosition: 5,
        },
    })
    type: CategoryType;

    @ExtendedProp({
        type: MultipleLanguageType,
        cms: {
            label: 'Short Description',
        },
    })
    @MultipleLanguage()
    shortDescription: MultipleLanguageType;

    @ExtendedProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.CATEGORIES,
        cms: {
            label: 'Parent',
        },
    })
    parent: Category;
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.plugin(autopopulateSoftDelete);
