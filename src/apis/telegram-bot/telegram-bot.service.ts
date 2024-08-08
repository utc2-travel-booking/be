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
import { appSettings } from 'src/configs/appsettings';

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
        if (appSettings.development) {
            const domains = domain.split('.');
            if (domains[1] === 'ngrok-free') {
                return await this.findOne({
                    domain: 'https://ngrok-free.app',
                }).exec();
            }
        }
        const result = await this.findOne({ domain }).exec();
        return result;
    }
}
