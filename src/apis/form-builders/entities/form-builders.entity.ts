import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import _ from 'lodash';
import { Document } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { FormBuilderType } from '../constants';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.FORM_BUILDER,
})
export class FormBuilder extends AggregateRoot {
    @Prop({ type: String, required: true, enum: FormBuilderType })
    type: FormBuilderType;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    email: string;

    @Prop({ type: String, required: true })
    subject: string;

    @Prop({ type: String })
    content: string;
}

export type FormBuilderDocument = FormBuilder & Document;
export const FormBuilderSchema = SchemaFactory.createForClass(FormBuilder);

FormBuilderSchema.plugin(autopopulateSoftDelete);
