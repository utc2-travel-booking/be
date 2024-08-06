import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.TELEGRAM_BOT,
})
export class TelegramBot extends AggregateRoot {
    @Prop({ required: true })
    token: string;

    @Prop()
    botId: string;

    @Prop()
    name: string;

    @Prop()
    domain: string;
}

export type TelegramBotDocument = TelegramBot & Document;

export const TelegramBotSchema = SchemaFactory.createForClass(TelegramBot);
TelegramBotSchema.plugin(autopopulateSoftDelete);
