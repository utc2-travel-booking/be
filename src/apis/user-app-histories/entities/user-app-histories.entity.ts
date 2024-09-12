import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { App, AppDocument } from 'src/apis/apps/entities/apps.entity';
import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';
import { ActionType } from '../constants';
import { AutoPopulate } from '@libs/super-search';
import { User } from 'src/apis/users/entities/user.entity';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.USER_APP_HISTORY,
})
export class UserAppHistory extends AggregateRoot {
    @SuperProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.APP,
        refClass: App,
    })
    app: AppDocument;

    @SuperProp({
        required: false,
        enum: ActionType,
    })
    action?: ActionType;

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

export type UserAppHistoryDocument = UserAppHistory & Document;
export const UserAppHistorySchema =
    SchemaFactory.createForClass(UserAppHistory);

UserAppHistorySchema.plugin(autopopulateSoftDelete);
