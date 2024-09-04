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
import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.CATEGORIES,
})
export class Category extends AggregateRoot {
    @SuperProp({
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

    @SuperProp({
        type: String,
        required: true,
        cms: {
            label: 'Slug',
            tableShow: true,
            columnPosition: 2,
        },
    })
    slug: string;

    @SuperProp({
        type: Number,
        default: 0,
        cms: {
            label: 'Position',
            tableShow: true,
            columnPosition: 3,
        },
    })
    position: number;

    @SuperProp({
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

    @SuperProp({
        type: String,
        enum: CategoryType,
        cms: {
            label: 'Type',
            tableShow: true,
            columnPosition: 5,
        },
    })
    type: CategoryType;

    @SuperProp({
        type: MultipleLanguageType,
        cms: {
            label: 'Short Description',
        },
    })
    @MultipleLanguage()
    shortDescription: MultipleLanguageType;

    @SuperProp({
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
