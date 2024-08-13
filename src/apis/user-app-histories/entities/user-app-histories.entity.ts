import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import _ from 'lodash';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { AutoPopulate } from 'src/packages/super-search';
import { App, AppDocument } from 'src/apis/apps/entities/apps.entity';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.USER_APP_HISTORY,
})
export class UserAppHistory extends AggregateRoot {
    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAMES.APP, refClass: App })
    @AutoPopulate({
        ref: COLLECTION_NAMES.APP,
    })
    app: AppDocument | Types.ObjectId;
}

export type UserAppHistoryDocument = UserAppHistory & Document;
export const UserAppHistorySchema =
    SchemaFactory.createForClass(UserAppHistory);

UserAppHistorySchema.plugin(autopopulateSoftDelete);
