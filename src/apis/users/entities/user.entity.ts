import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import _ from 'lodash';
import { Document, Types } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { UserStatus } from '../constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { AutoPopulate } from 'src/packages/super-search';
import { File } from 'src/apis/media/entities/files.entity';
import { Role } from 'src/apis/roles/entities/roles.entity';

export type UserDocument = User & Document;

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.USER,
})
export class User {
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
        autopopulate: true,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
    })
    avatar: File;

    @Prop({
        type: Types.ObjectId,
        required: true,
        ref: COLLECTION_NAMES.ROLE,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.ROLE,
    })
    role: Role;

    @Prop({
        type: String,
        enum: UserStatus,
        default: UserStatus.ACTIVE,
    })
    status: UserStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(autopopulateSoftDelete);
