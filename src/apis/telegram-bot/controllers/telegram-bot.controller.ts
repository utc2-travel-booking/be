import { Body, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { TelegramBotService } from 'src/apis/telegram-bot/telegram-bot.service';
import { UserPayload } from 'src/base/models/user-payload.model';
import { COLLECTION_NAMES } from 'src/constants';

import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { CreateTelegramBotDto } from '../dto/create-telegram-bot.dto';
import { UpdateTelegramBotDto } from '../dto/update-telegram-bot.dto';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { ExtendedPost } from '@libs/super-core/decorators/extended-post.decorator';
import { ExtendedPut } from '@libs/super-core/decorators/extended-put.decorator';
import { ExtendedGet } from '@libs/super-core/decorators/extended-get.decorator';
import { ExtendedDelete } from '@libs/super-core/decorators/extended-delete.decorator';
import { SuperController } from '@libs/super-core';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';

@SuperController('telegram-bots')
@ApiTags('Admin: Telegram Bot')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.TELEGRAM_BOT,
})
export class TelegramBotControllerAdmin {
    constructor(private readonly telegramBotService: TelegramBotService) {}

    @ExtendedGet()
    @SuperAuthorize()
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.telegramBotService.getAll(queryParams);
        return result;
    }

    @ExtendedGet({ route: ':id' })
    @SuperAuthorize()
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.telegramBotService.getOne(_id);
        return result;
    }

    @ExtendedPost({
        dto: CreateTelegramBotDto,
    })
    @SuperAuthorize()
    async create(
        @Body() createTelegramBotDto: CreateTelegramBotDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.telegramBotService.createOne(
            createTelegramBotDto,
            user,
        );

        return result;
    }

    @ExtendedPut({ route: ':id', dto: UpdateTelegramBotDto })
    @SuperAuthorize()
    @ApiParam({ name: 'id', type: String })
    async update(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Body() updateTelegramBotDto: UpdateTelegramBotDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.telegramBotService.updateOneById(
            _id,
            updateTelegramBotDto,
            user,
        );

        return result;
    }

    @ExtendedDelete()
    @SuperAuthorize()
    @ApiQuery({ name: 'ids', type: [String] })
    async deletes(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.telegramBotService.deletes(_ids, user);
        return result;
    }
}
