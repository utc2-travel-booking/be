import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { File } from 'src/apis/media/entities/files.entity';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import { AutoPopulate } from 'src/packages/super-search';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.ADVERTISER,
})
export class Advertiser extends AggregateRoot {
    @Prop({ type: String })
    name: string;

    @Prop({
        type: [Types.ObjectId],
        ref: COLLECTION_NAMES.FILE,
        refClass: File,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
        isArray: true,
    })
    bannerImages: File[];
}

export type AdvertiserDocument = Advertiser & Document;
export const AdvertiserSchema = SchemaFactory.createForClass(Advertiser);
AdvertiserSchema.plugin(autopopulateSoftDelete);
