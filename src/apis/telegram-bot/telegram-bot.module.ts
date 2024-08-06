import { MongooseModule } from '@nestjs/mongoose';
import { TelegramBotService } from './telegram-bot.service';
import { Module } from '@nestjs/common';
import { COLLECTION_NAMES } from 'src/constants';
import { TelegramBotSchema } from './entities/telegram-bot.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: COLLECTION_NAMES.TELEGRAM_BOT, schema: TelegramBotSchema },
        ]),
    ],
    controllers: [],
    providers: [TelegramBotService],
    exports: [TelegramBotService],
})
export class TelegramBotModule {}
