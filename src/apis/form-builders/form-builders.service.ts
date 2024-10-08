import { Injectable } from '@nestjs/common';
import { FormBuilderDocument } from './entities/form-builders.entity';
import { COLLECTION_NAMES } from 'src/constants';
import { CreateFormBuildersDto } from './dto/create-form-builders.dto';
import TelegramBot from 'node-telegram-bot-api';
import { appSettings } from 'src/configs/app-settings';
import { BaseService } from 'src/base/service/base.service';
import { ExtendedInjectModel } from '@libs/super-core';
import { ExtendedModel } from '@libs/super-core/interfaces/extended-model.interface';

@Injectable()
export class FormBuilderService extends BaseService<FormBuilderDocument> {
    constructor(
        @ExtendedInjectModel(COLLECTION_NAMES.FORM_BUILDER)
        private readonly formBuildersModel: ExtendedModel<FormBuilderDocument>,
    ) {
        super(formBuildersModel);
    }
    async createOne(createFormBuilderDto: CreateFormBuildersDto) {
        const { type, subject, name, email, content } = createFormBuilderDto;
        const result = await this.formBuildersModel.create({
            ...createFormBuilderDto,
        });

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
