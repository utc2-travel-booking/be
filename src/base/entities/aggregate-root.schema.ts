import { Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { AutoPopulate } from '@libs/super-search';
import { ExtendedProp } from '@libs/super-core/decorators/extended-prop.decorator';

@Schema()
export abstract class AggregateRoot {
    @ExtendedProp({
        default: null,
        cms: {
            label: 'Deleted At',
        },
    })
    deletedAt: Date;

    @ExtendedProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.USER,
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

    @ExtendedProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.USER,
        cms: {
            label: 'Updated By',
        },
    })
    updatedBy: Types.ObjectId;

    @ExtendedProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.USER,
        cms: {
            label: 'Deleted By',
        },
    })
    deletedBy: Types.ObjectId;
}
