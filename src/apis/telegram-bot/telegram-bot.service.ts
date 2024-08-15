import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import {
    TelegramBot,
    TelegramBotDocument,
} from './entities/telegram-bot.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model } from 'mongoose';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class TelegramBotService extends BaseService<
    TelegramBotDocument,
    TelegramBot
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.TELEGRAM_BOT)
        private readonly telegramBotModel: Model<TelegramBotDocument>,
        moduleRef: ModuleRef,
    ) {
        super(
            telegramBotModel,
            TelegramBot,
            COLLECTION_NAMES.TELEGRAM_BOT,
            moduleRef,
        );
    }

    async findByDomain(domain: string): Promise<TelegramBotDocument> {
        if (!domain) {
            return null;
        }
        const result = await this.findOne({ domain }).exec();
        return result;
    }
}
