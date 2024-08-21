import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import {
    MultipleLanguage,
    MultipleLanguageType,
} from 'libs/super-multiple-language';
import { AutoPopulate } from 'libs/super-search';
import { File, FileDocument } from 'src/apis/media/entities/files.entity';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.TAG,
})
export class Tag extends AggregateRoot {
    @Prop({ type: MultipleLanguageType, required: true })
    @MultipleLanguage()
    name: MultipleLanguageType;

    @Prop({ type: String, required: true })
    slug: string;

    @Prop({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.FILE,
        refClass: File,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
    })
    featuredImage: FileDocument;
}

export type TagDocument = Tag & Document;
export const TagSchema = SchemaFactory.createForClass(Tag);

TagSchema.plugin(autopopulateSoftDelete);
