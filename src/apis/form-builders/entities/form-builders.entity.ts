import { Schema, SchemaFactory } from '@nestjs/mongoose';
import _ from 'lodash';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { FormBuilderType } from '../constants';
import { ExtendedProp } from '@libs/super-core/decorators/extended-prop.decorator';
import { AutoPopulate } from '@libs/super-search';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.FORM_BUILDER,
})
export class FormBuilder extends AggregateRoot {
    @ExtendedProp({
        type: String,
        required: true,
        enum: FormBuilderType,
        cms: {
            label: 'Type',
            tableShow: true,
            columnPosition: 1,
        },
    })
    type: FormBuilderType;

    @ExtendedProp({
        type: String,
        required: true,
        cms: {
            label: 'Name',
            tableShow: true,
            columnPosition: 2,
        },
    })
    name: string;

    @ExtendedProp({
        type: String,
        required: true,
        cms: {
            label: 'Email',
            tableShow: true,
            columnPosition: 3,
        },
    })
    email: string;

    @ExtendedProp({
        type: String,
        required: true,
        cms: {
            label: 'Subject',
            tableShow: true,
            columnPosition: 4,
        },
    })
    subject: string;

    @ExtendedProp({
        type: String,
        cms: {
            label: 'Content',
            tableShow: true,
            columnPosition: 5,
        },
    })
    content: string;

    @ExtendedProp({
        type: Date,
        cms: {
            label: 'Created At',
            tableShow: true,
            columnPosition: 6,
        },
        default: new Date(),
    })
    createdAt: Date;

    @ExtendedProp({
        type: Types.ObjectId,
        ref: COLLECTION_NAMES.USER,
        cms: {
            label: 'Created By',
        },
    })
    @AutoPopulate({
        ref: COLLECTION_NAMES.USER,
    })
    createdBy: Types.ObjectId;
}

export type FormBuilderDocument = FormBuilder & Document;
export const FormBuilderSchema = SchemaFactory.createForClass(FormBuilder);

FormBuilderSchema.plugin(autopopulateSoftDelete);
