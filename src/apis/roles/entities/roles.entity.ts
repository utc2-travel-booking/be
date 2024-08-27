import { Schema, SchemaFactory } from '@nestjs/mongoose';
import _ from 'lodash';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { AutoPopulate } from '@libs/super-search';
import { RoleType } from '../constants';
import { ExtendedProp } from '@libs/super-core/decorators/extended-prop.decorator';
import {
    Permission,
    PermissionDocument,
} from '@libs/super-authorize/modules/permissions/entities/permissions.entity';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.ROLE,
})
export class Role extends AggregateRoot {
    @ExtendedProp({
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

    @ExtendedProp({
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

    @ExtendedProp({
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
}

export type RoleDocument = Role & Document;
export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.plugin(autopopulateSoftDelete);
