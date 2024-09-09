import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';
import { RequestMethod } from '../constants';
import { PermissionMetadata } from '@libs/super-authorize/metadata/permission.interface';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.PERMISSION,
})
export class Permission implements PermissionMetadata {
    @SuperProp({ type: String })
    path: string;

    @SuperProp({ type: String })
    prefix: string;

    @SuperProp({ type: String, enum: RequestMethod })
    requestMethod: string;
}

export type PermissionDocument = Permission & Document;

export const PermissionSchema = SchemaFactory.createForClass(Permission);
