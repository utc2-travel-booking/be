import { SuperProp } from '@libs/super-core';
import { AutoPopulate } from '@libs/super-search';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { File } from 'src/apis/media/entities/files.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';

@Schema({})
export class SEOTag {
    @SuperProp({ type: String })
    title: string;

    @SuperProp({ type: String })
    description: string;
}

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.PAGE,
})
export class Page extends AggregateRoot {
    @SuperProp({
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

    @SuperProp({
        type: String,
        required: true,
        unique: true,
        cms: {
            label: 'Slug',
            tableShow: true,
            columnPosition: 2,
        },
    })
    slug: string;

    @SuperProp({
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

    @SuperProp({
        type: SEOTag,
    })
    seoTag: SEOTag;

    @SuperProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.USER,
        refClass: User,
        cms: {
            label: 'Created By',
            tableShow: true,
            columnPosition: 99,
        },
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.USER,
    })
    createdBy: Types.ObjectId;
}

export type PageDocument = Page & Document;
export const PageSchema = SchemaFactory.createForClass(Page);
PageSchema.plugin(autopopulateSoftDelete);
