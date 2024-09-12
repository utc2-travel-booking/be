import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';
import { AutoPopulate } from '@libs/super-search';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { File } from 'src/apis/media/entities/files.entity';
import { User } from 'src/apis/users/entities/user.entity';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';

export class BannerImage {
    @SuperProp({ type: String, required: true })
    urlRedirect: string;

    @SuperProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.FILE,
        required: true,
        refClass: File,
    })
    featuredImage: Types.ObjectId;

    @SuperProp({ type: String, required: true })
    title: string;

    @SuperProp({ type: String, required: true })
    shortDescription: string;

    @SuperProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.FILE,
        required: true,
        refClass: File,
    })
    iconImage: Types.ObjectId;

    @SuperProp({ type: String, required: true })
    labelButton: string;
}

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.ADVERTISER,
})
export class Advertiser extends AggregateRoot {
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
        cms: {
            label: 'Slug',
            tableShow: true,
            columnPosition: 2,
        },
    })
    slug: string;

    @SuperProp({
        type: [BannerImage],
    })
    bannerImages: BannerImage[];

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

export type AdvertiserDocument = Advertiser & Document;
export const AdvertiserSchema = SchemaFactory.createForClass(Advertiser);
AdvertiserSchema.plugin(autopopulateSoftDelete);
