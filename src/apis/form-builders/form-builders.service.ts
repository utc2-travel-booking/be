import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/_base.service';
import {
    FormBuilderDocument,
    FormBuilder,
} from './entities/form-builders.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model } from 'mongoose';
import { CreateFormBuildersDto } from './dto/create-form-builders.dto';
import { ModuleRef } from '@nestjs/core';
import TelegramBot from 'node-telegram-bot-api';
import { appSettings } from 'src/configs/app-settings';

@Injectable()
export class FormBuilderService extends BaseService<
    FormBuilderDocument,
    FormBuilder
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.FORM_BUILDER)
        private readonly formBuildersModel: Model<FormBuilderDocument>,
        moduleRef: ModuleRef,
    ) {
        super(
            formBuildersModel,
            FormBuilder,
            COLLECTION_NAMES.FORM_BUILDER,
            moduleRef,
        );
    }
    async createOne(createFormBuilderDto: CreateFormBuildersDto) {
        const { type, subject, name, email, content } = createFormBuilderDto;
        const result = new this.model({
            ...createFormBuilderDto,
        });
        await this.create(result);

        const bot = new TelegramBot(
            appSettings.provider.telegram.contractBotToken,
        );
        const markdownMessage = `📩📩📩📩📩\n<strong>${type}</strong>\nSubject: <strong>${subject}</strong>\nName: <strong>${name}</strong>\nEmail: <strong>${email}</strong>\n🗣️\n<code>${content}</code>`;
        await bot.sendMessage(
            appSettings.provider.telegram.contractChannelId,
            markdownMessage,
            {
                parse_mode: 'HTML',
            },
        );

        return result;
    }
}
