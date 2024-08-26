import { Schema, SchemaFactory } from '@nestjs/mongoose';
import _ from 'lodash';
import { Document } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { ExtendedProp } from '@libs/super-core/decorators/extended-prop.decorator';
import { RequestMethod } from '../constants';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.PERMISSION,
})
export class Permission {
    @ExtendedProp({ type: String })
    prefix: string;

    @ExtendedProp({ type: String })
    pathName: string;

    @ExtendedProp({ type: String, enum: RequestMethod })
    requestMethod: string;
}

export type PermissionDocument = Permission & Document;

export const PermissionSchema = SchemaFactory.createForClass(Permission);
