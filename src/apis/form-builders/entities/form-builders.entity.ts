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
export class FormBuilders extends AggregateRoot {
    @Prop({ type: String, required: true })
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

export type FormBuilderDocument = FormBuilders & Document;
export const FormBuilderSchema = SchemaFactory.createForClass(FormBuilders);

FormBuilderSchema.plugin(autopopulateSoftDelete);
