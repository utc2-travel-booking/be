import { Body, Controller, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { TelegramBotService } from 'src/apis/telegram-bot/telegram-bot.service';
import { UserPayload } from 'src/base/models/user-payload.model';
import { COLLECTION_NAMES, PERMISSIONS } from 'src/constants';
import { Authorize } from 'src/decorators/authorize.decorator';
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

@Controller('telegram-bots')
@ApiTags('Admin: Telegram Bot')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.TELEGRAM_BOT,
})
export class TelegramBotControllerAdmin {
    constructor(private readonly telegramBotService: TelegramBotService) {}

    @ExtendedGet()
    @Authorize(PERMISSIONS.TELEGRAM_BOT.index)
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.telegramBotService.getAll(queryParams);
        return result;
    }

    @ExtendedGet({ route: ':id' })
    @Authorize(PERMISSIONS.TELEGRAM_BOT.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.telegramBotService.getOne(_id);
        return result;
    }

    @ExtendedPost({
        dto: CreateTelegramBotDto,
    })
    @Authorize(PERMISSIONS.TELEGRAM_BOT.create)
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
    @Authorize(PERMISSIONS.TELEGRAM_BOT.edit)
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
    @Authorize(PERMISSIONS.TELEGRAM_BOT.destroy)
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
