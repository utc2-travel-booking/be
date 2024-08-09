import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import _ from 'lodash';
import { Document, Types } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { UserStatus } from '../constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { AutoPopulate } from 'src/packages/super-search';
import { File } from 'src/apis/media/entities/files.entity';
import { Role, RoleDocument } from 'src/apis/roles/entities/roles.entity';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';

export type UserDocument = User & Document;

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.USER,
})
export class User extends AggregateRoot {
    @Prop({
        type: String,
        required: false,
        default: 'No Name',
    })
    name: string;

    @Prop({
        type: String,
        required: false,
    })
    email: string;

    @Prop({
        type: String,
        required: false,
    })
    password: string;

    @Prop({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.FILE,
        refClass: File,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
    })
    avatar: File;

    @Prop({
        type: Types.ObjectId,
        required: true,
        ref: COLLECTION_NAMES.ROLE,
        refClass: Role,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.ROLE,
    })
    role: RoleDocument;

    @Prop({
        type: String,
        enum: UserStatus,
        default: UserStatus.ACTIVE,
    })
    status: UserStatus;

    @Prop({
        type: Number,
        required: false,
    })
    telegramUserId: number;

    @Prop({
        type: String,
        required: false,
    })
    telegramUsername: string;

    @Prop({
        type: Number,
        default: 0,
    })
    currentPoint: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(autopopulateSoftDelete);
