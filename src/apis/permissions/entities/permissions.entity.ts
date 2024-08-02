import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import _ from 'lodash';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { Document } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.PERMISSION,
})
export class Permission extends AggregateRoot {
    @Prop({ type: String, required: true, unique: true })
    name: string;

    @Prop({ type: String, required: true })
    collectionName: string;
}

export type PermissionDocument = Permission & Document;

export const PermissionSchema = SchemaFactory.createForClass(Permission);
