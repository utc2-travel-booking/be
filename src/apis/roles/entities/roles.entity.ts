/* eslint-disable @typescript-eslint/no-var-requires */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import _ from 'lodash';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { AutoPopulate } from 'src/packages/super-search';
import {
    Permission,
    PermissionDocument,
} from 'src/apis/permissions/entities/permissions.entity';
import { RoleType } from '../constants';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.ROLE,
})
export class Role extends AggregateRoot {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({
        type: Number,
        required: true,
        unique: true,
    })
    type: RoleType;

    @Prop({
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
