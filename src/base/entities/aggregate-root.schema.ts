import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { AutoPopulate } from 'src/packages/super-search';

@Schema()
export abstract class AggregateRoot {
    @Prop({
        default: null,
    })
    deletedAt: Date;

    @Prop({
        type: Types.ObjectId,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.USER,
    })
    createdBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAMES.USER })
    updatedBy: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAMES.USER })
    deletedBy: Types.ObjectId;
}
