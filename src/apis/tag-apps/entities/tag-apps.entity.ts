import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { AutoPopulate } from '@libs/super-search';
import { Tag, TagDocument } from 'src/apis/tags/entities/tags.entity';
import { App, AppDocument } from 'src/apis/apps/entities/apps.entity';
import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.TAG_APP,
})
export class TagApp extends AggregateRoot {
    @SuperProp({
        type: Number,
        default: 1,
        cms: {
            label: 'Position',
            tableShow: true,
            index: true,
            columnPosition: 1,
        },
    })
    position: number;

    @SuperProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.TAG,
        refClass: Tag,
        cms: {
            label: 'Tag',
            tableShow: true,
            columnPosition: 2,
        },
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.TAG,
    })
    tag: TagDocument;

    @SuperProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.APP,
        refClass: App,
        cms: {
            label: 'App',
            tableShow: true,
            columnPosition: 3,
        },
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.APP,
    })
    app: AppDocument;
}

export type TagAppDocument = TagApp & Document;
export const TagAppSchema = SchemaFactory.createForClass(TagApp);
TagAppSchema.plugin(autopopulateSoftDelete);
