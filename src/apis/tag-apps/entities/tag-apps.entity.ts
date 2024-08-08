import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { AutoPopulate } from 'src/packages/super-search';
import { Tag, TagDocument } from 'src/apis/tags/entities/tags.entity';
import { App, AppDocument } from 'src/apis/apps/entities/apps.entity';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.TAG_APP,
})
export class TagApp extends AggregateRoot {
    @Prop({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.TAG,
        refClass: Tag,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
    })
    tag: TagDocument;

    @Prop({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.APP,
        refClass: App,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.APP,
    })
    app: AppDocument;

    @Prop({ type: Number, default: 0 })
    position: number;
}

export type TagAppDocument = TagApp & Document;
export const TagAppSchema = SchemaFactory.createForClass(TagApp);
TagAppSchema.plugin(autopopulateSoftDelete);
