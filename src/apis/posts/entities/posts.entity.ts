import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import { PostStatus, PostType } from '../constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import {
    MultipleLanguage,
    MultipleLanguageType,
} from '@libs/super-multiple-language';
import { AutoPopulate } from '@libs/super-search';
import { Category } from 'src/apis/categories/entities/categories.entity';
import { File } from 'src/apis/media/entities/files.entity';
import { ExtendedProp } from '@libs/super-core/decorators/extended-prop.decorator';
@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.POST,
})
export class Post extends AggregateRoot {
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
    featuredImage: File;

    @ExtendedProp({
        type: String,
        enum: PostStatus,
        default: PostStatus.DRAFT,
        cms: {
            label: 'Status',
            tableShow: true,
            columnPosition: 4,
        },
    })
    status: PostStatus;

    @ExtendedProp({
        type: String,
        enum: PostType,
        cms: {
            label: 'Type',
            tableShow: true,
            columnPosition: 5,
        },
    })
    type: PostType;

    @ExtendedProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.CATEGORIES,
        refClass: Category,
        cms: {
            label: 'Category',
            tableShow: true,
            columnPosition: 6,
        },
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.CATEGORIES,
    })
    category: Category;

    @ExtendedProp({
        type: MultipleLanguageType,
        cms: {
            label: 'Short Description',
            tableShow: true,
            columnPosition: 7,
        },
    })
    @MultipleLanguage()
    shortDescription: MultipleLanguageType;

    @ExtendedProp({
        type: Date,
        default: null,
        cms: {
            label: 'Published Start',
            tableShow: true,
            columnPosition: 8,
        },
    })
    publishedStart: Date;

    @ExtendedProp({
        type: Date,
        default: null,
        cms: {
            label: 'Published End',
            tableShow: true,
            columnPosition: 9,
        },
    })
    publishedEnd: Date;

    @ExtendedProp({ type: MultipleLanguageType })
    @MultipleLanguage()
    longDescription: MultipleLanguageType;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.plugin(autopopulateSoftDelete);
