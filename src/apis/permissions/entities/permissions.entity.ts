import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import _ from 'lodash';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { Document } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { ExtendedProp } from '@libs/super-core/decorators/extended-prop.decorator';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.PERMISSION,
})
export class Permission extends AggregateRoot {
    @ExtendedProp({ type: String, required: true, unique: true })
    name: string;

    @ExtendedProp({ type: String, required: true })
    collectionName: string;
}

export type PermissionDocument = Permission & Document;

export const PermissionSchema = SchemaFactory.createForClass(Permission);
