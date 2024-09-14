import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { AutoPopulate } from '@libs/super-search';
import { RoleType } from '../constants';
import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';
import {
    Permission,
    PermissionDocument,
} from '@libs/super-authorize/modules/permissions/entities/permissions.entity';
import { User } from 'src/apis/users/entities/user.entity';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.ROLE,
})
export class Role extends AggregateRoot {
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
        type: Number,
        required: true,
        unique: true,
        cms: {
            label: 'Type',
            tableShow: true,
            columnPosition: 2,
        },
    })
    type: RoleType;

    @SuperProp({
        type: [Types.ObjectId],
        ref: COLLECTION_NAMES.PERMISSION,
        default: [],
        refClass: Permission,
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.PERMISSION,
        isArray: true,
    })
    permissions: PermissionDocument[];

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

export type RoleDocument = Role & Document;
export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.plugin(autopopulateSoftDelete);
