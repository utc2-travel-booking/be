import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import { PostStatus, PostType } from '../constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import {
    MultipleLanguage,
    MultipleLanguageType,
} from 'src/packages/super-multiple-language';
import { AutoPopulate } from 'src/packages/super-search';
import { Category } from 'src/apis/categories/entities/categories.entity';
import { File } from 'src/apis/media/entities/files.entity';
@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.POST,
})
export class Post extends AggregateRoot {
    @Prop({ type: MultipleLanguageType, required: true })
    @MultipleLanguage()
    name: MultipleLanguageType;

    @Prop({ type: String, required: true })
    slug: string;

    @Prop({ type: MultipleLanguageType })
    @MultipleLanguage()
    shortDescription: MultipleLanguageType;

    @Prop({ type: MultipleLanguageType })
    @MultipleLanguage()
    longDescription: MultipleLanguageType;

    @Prop({ type: String, enum: PostType })
    type: PostType;

    @Prop({ type: String, enum: PostStatus, default: PostStatus.DRAFT })
    status: PostStatus;

    @Prop({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.FILE,
        refClass: File,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
    })
    featuredImage: File;

    @Prop({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.CATEGORIES,
        refClass: Category,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.CATEGORIES,
    })
    category: Category;

    @Prop({ type: Date, default: null })
    publishedStart: Date;

    @Prop({ type: Date, default: null })
    publishedEnd: Date;
}

export type PostDocument = Post & Document;
export const PostSchema = SchemaFactory.createForClass(Post);
PostSchema.plugin(autopopulateSoftDelete);
