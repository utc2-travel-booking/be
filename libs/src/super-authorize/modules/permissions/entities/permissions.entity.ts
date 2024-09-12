import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';
import { RequestMethod } from '../constants';
import { PermissionMetadata } from '@libs/super-authorize/metadata/permission.interface';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { User } from 'src/apis/users/entities/user.entity';
import { AutoPopulate } from '@libs/super-search';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.PERMISSION,
})
export class Permission extends AggregateRoot implements PermissionMetadata {
    @SuperProp({ type: String })
    path: string;

    @SuperProp({ type: String })
    prefix: string;

    @SuperProp({ type: String, enum: RequestMethod })
    requestMethod: string;

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

export type PermissionDocument = Permission & Document;

export const PermissionSchema = SchemaFactory.createForClass(Permission);
