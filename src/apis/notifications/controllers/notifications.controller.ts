import { Body, Param, Query, Req } from '@nestjs/common';
import { NotificationsService } from '../notifications.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';

import { COLLECTION_NAMES } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { UserPayload } from 'src/base/models/user-payload.model';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { UpdateStatusNotificationDto } from '../dto/update-status-notifications.dto';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { ExtendedPut } from '@libs/super-core/decorators/extended-put.decorator';
import { ExtendedGet } from '@libs/super-core/decorators/extended-get.decorator';
import { ExtendedDelete } from '@libs/super-core/decorators/extended-delete.decorator';
import { SuperController } from '@libs/super-core';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';

@SuperController('notifications')
@ApiTags('Front: Notifications')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.NOTIFICATION,
})
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @ExtendedGet()
    @SuperAuthorize()
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.notificationsService.getNotificationsOfUser(
            queryParams,
            user,
        );
        return result;
    }

    @ExtendedGet({ route: 'count' })
    @SuperAuthorize()
    async countNotificationUnreadOfUser(@Req() req: { user: UserPayload }) {
        const { user } = req;
        const { _id } = user;

        const result =
            await this.notificationsService.countNotificationUnreadOfUser(_id);
        return result;
    }

    @ExtendedPut({ route: 'read', dto: UpdateStatusNotificationDto })
    @SuperAuthorize()
    async updateStatus(
        @Body() updateStatusNotificationDto: UpdateStatusNotificationDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result =
            await this.notificationsService.updateNotificationsStatus(
                updateStatusNotificationDto,
                user,
            );
        return result;
    }

    @ExtendedPut({ route: 'read/all' })
    @SuperAuthorize()
    async updateAllStatus(@Req() req: { user: UserPayload }) {
        const { user } = req;

        const result = await this.notificationsService.updateAllStatus(user);
        return result;
    }

    @ExtendedDelete({ route: ':id' })
    @SuperAuthorize()
    @ApiParam({ name: 'id', type: String })
    async deleteOne(
        @Param('id', ParseObjectIdPipe) _id: Types.ObjectId,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.notificationsService.deleteNotificationOfUser(
            _id,
            user,
        );
        return result;
    }
}
