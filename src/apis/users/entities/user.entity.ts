import { SchemaFactory, Schema } from '@nestjs/mongoose';
import _ from 'lodash';
import { Document, Types } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { UserStatus } from '../constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { AutoPopulate } from '@libs/super-search';
import { File } from 'src/apis/media/entities/files.entity';
import { Role, RoleDocument } from 'src/apis/roles/entities/roles.entity';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';

export type UserDocument = User & Document;

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.USER,
})
export class User extends AggregateRoot {
    @SuperProp({
        type: String,
        required: false,
        default: 'No Name',
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
        required: false,
        cms: {
            label: 'Email',
            tableShow: true,
            columnPosition: 2,
        },
    })
    email: string;

    @SuperProp({
        type: Number,
        required: false,
        cms: {
            label: 'Telegram User ID',
            tableShow: true,
            columnPosition: 3,
        },
    })
    telegramUserId: number;

    @SuperProp({
        type: String,
        required: false,
        cms: {
            label: 'Telegram Username',
            tableShow: true,
            columnPosition: 4,
        },
    })
    telegramUsername: string;

    @SuperProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.FILE,
        refClass: File,
        cms: {
            label: 'Avatar',
            tableShow: true,
            columnPosition: 5,
        },
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.FILE,
    })
    avatar: File;

    @SuperProp({
        type: Number,
        default: 0,
        cms: {
            label: 'Current Point',
            tableShow: true,
            columnPosition: 6,
        },
    })
    currentPoint: number;

    @SuperProp({
        type: Types.ObjectId,
        required: true,
        ref: COLLECTION_NAMES.ROLE,
        refClass: Role,
        cms: {
            label: 'Role',
            tableShow: true,
            columnPosition: 7,
        },
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.ROLE,
    })
    role: RoleDocument;

    @SuperProp({
        type: String,
        enum: UserStatus,
        default: UserStatus.ACTIVE,
        cms: {
            label: 'Status',
            tableShow: true,
            columnPosition: 8,
        },
    })
    status: UserStatus;

    @SuperProp({
        type: String,
        required: false,
    })
    password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.plugin(autopopulateSoftDelete);
