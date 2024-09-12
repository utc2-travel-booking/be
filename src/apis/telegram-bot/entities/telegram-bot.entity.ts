import { SuperProp } from '@libs/super-core/decorators/super-prop.decorator';
import { AutoPopulate } from '@libs/super-search';
import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/apis/users/entities/user.entity';
import { AggregateRoot } from 'src/base/entities/aggregate-root.schema';
import { COLLECTION_NAMES } from 'src/constants';
import autopopulateSoftDelete from 'src/utils/mongoose-plugins/autopopulate-soft-delete';

@Schema({
    timestamps: true,
    collection: COLLECTION_NAMES.TELEGRAM_BOT,
})
export class TelegramBot extends AggregateRoot {
    @SuperProp({
        type: String,
        cms: {
            label: 'Name',
            tableShow: true,
            index: true,
            columnPosition: 1,
        },
    })
    name: string;

    @SuperProp({
        required: true,
        cms: {
            label: 'Token',
            tableShow: true,
            columnPosition: 2,
        },
        autoPopulateExclude: true,
    })
    token: string;

    @SuperProp({
        type: String,
        cms: {
            label: 'Bot ID',
            tableShow: true,
            columnPosition: 3,
        },
    })
    botId: string;

    @SuperProp({
        type: String,
        cms: {
            label: 'Domain',
            tableShow: true,
            columnPosition: 4,
        },
    })
    domain: string;

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

export type TelegramBotDocument = TelegramBot & Document;

export const TelegramBotSchema = SchemaFactory.createForClass(TelegramBot);
TelegramBotSchema.plugin(autopopulateSoftDelete);
