import { Schema } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { AutoPopulate } from '@libs/super-search';
import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';

@Schema()
export abstract class AggregateRoot extends Document<Types.ObjectId> {
    @SuperProp({
        default: null,
        cms: {
            label: 'Deleted At',
        },
    })
    deletedAt: Date;

    @SuperProp({
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

    @SuperProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.USER,
        cms: {
            label: 'Updated By',
        },
    })
    updatedBy: Types.ObjectId;

    @SuperProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.USER,
        cms: {
            label: 'Deleted By',
        },
    })
    deletedBy: Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}
