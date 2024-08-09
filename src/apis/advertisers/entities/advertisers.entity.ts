import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';

export class BannerImage {
    @Prop({ type: String, required: true })
    urlRedirect: string;

    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAMES.FILE, required: true })
    featuredImage: Types.ObjectId;
}

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.ADVERTISER,
})
export class Advertiser extends AggregateRoot {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, unique: true })
    slug: string;

    @Prop({
        type: [BannerImage],
    })
    bannerImages: BannerImage[];
}

export type AdvertiserDocument = Advertiser & Document;
export const AdvertiserSchema = SchemaFactory.createForClass(Advertiser);
AdvertiserSchema.plugin(autopopulateSoftDelete);
