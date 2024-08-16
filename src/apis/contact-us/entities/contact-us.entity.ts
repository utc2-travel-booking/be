import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import _ from 'lodash';
import { Document } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';
import { ContactUsType } from '../constants';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.CONTACT_US,
})
export class ContactUs extends AggregateRoot {
    @Prop({ type: String, required: true })
    type: ContactUsType;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: true })
    email: string;

    @Prop({ type: String, required: true })
    subject: string;

    @Prop({ type: String })
    message: string;
}

export type ContactUsDocument = ContactUs & Document;
export const ContactUsSchema = SchemaFactory.createForClass(ContactUs);

ContactUsSchema.plugin(autopopulateSoftDelete);
