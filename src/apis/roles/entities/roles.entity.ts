/* eslint-disable @typescript-eslint/no-var-requires */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import _ from 'lodash';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { AutoPopulate } from 'src/packages/super-search';
import { Permission } from 'src/apis/permissions/entities/permissions.entity';

export enum RoleType {
    ADMIN = 100,
    USER = 1,
}

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
    })
    type: RoleType;

    @Prop({
        type: [Types.ObjectId],
        ref: COLLECTION_NAMES.PERMISSION,
        default: [],
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.PERMISSION,
    })
    permissions: Permission[];
}

export type RoleDocument = Role & Document;
export const RoleSchema = SchemaFactory.createForClass(Role);

RoleSchema.plugin(autopopulateSoftDelete);
