import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import _ from 'lodash';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { Document } from 'mongoose';

@Schema({
    timestamps: true,
    collection: `${_.camelCase(Permission.name)}s`,
})
export class Permission extends AggregateRoot {
    @Prop({ type: String, required: true, unique: true })
    name: string;

    @Prop({ type: String, required: true })
    collectionName: string;
}

export type PermissionDocument = Permission & Document;

export const PermissionSchema = SchemaFactory.createForClass(Permission);
