import { ExtendedProp } from '@libs/super-core/decorators/extended-prop.decorator';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';

export class BannerImage {
    @ExtendedProp({ type: String, required: true })
    urlRedirect: string;

    @ExtendedProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.FILE,
        required: true,
    })
    featuredImage: Types.ObjectId;
}

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.ADVERTISER,
})
export class Advertiser extends AggregateRoot {
    @ExtendedProp({
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

    @ExtendedProp({
        type: String,
        cms: {
            label: 'Slug',
            tableShow: true,
            columnPosition: 2,
        },
    })
    slug: string;

    @ExtendedProp({
        type: [BannerImage],
    })
    bannerImages: BannerImage[];
}

export type AdvertiserDocument = Advertiser & Document;
export const AdvertiserSchema = SchemaFactory.createForClass(Advertiser);
AdvertiserSchema.plugin(autopopulateSoftDelete);
