import { Schema, SchemaFactory } from '@nestjs/mongoose';
import _ from 'lodash';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { App, AppDocument } from 'src/apis/apps/entities/apps.entity';
import { ExtendedProp } from '@libs/super-core/decorators/extended-prop.decorator';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.USER_APP_HISTORY,
})
export class UserAppHistory extends AggregateRoot {
    @ExtendedProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.APP,
        refClass: App,
    })
    app: AppDocument;
}

export type UserAppHistoryDocument = UserAppHistory & Document;
export const UserAppHistorySchema =
    SchemaFactory.createForClass(UserAppHistory);

UserAppHistorySchema.plugin(autopopulateSoftDelete);
