import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import { CategoryType } from '../constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.CATEGORIES,
})
export class Category extends AggregateRoot {
    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: Number, default: 0 })
    position: number;

    @Prop({ type: Types.ObjectId, ref: COLLECTION_NAMES.CATEGORIES })
    parent: Category;

    @Prop({ type: String, enum: CategoryType })
    type: CategoryType;
}

export type CategoryDocument = Category & Document;
export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.plugin(autopopulateSoftDelete);
