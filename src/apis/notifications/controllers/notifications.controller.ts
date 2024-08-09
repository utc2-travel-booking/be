import { Body, Controller, Param, Query, Req } from '@nestjs/common';
import { NotificationsService } from '../notifications.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Authorize } from 'src/decorators/authorize.decorator';
import { COLLECTION_NAMES, PERMISSIONS_FRONT } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { UserPayload } from 'src/base/models/user-payload.model';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { UpdateStatusNotificationDto } from '../dto/update-status-notifications.dto';
import {
    DefaultDelete,
    DefaultGet,
    DefaultPut,
} from 'src/base/controllers/base.controller';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';

@Controller('notifications')
@ApiTags('Front: Notifications')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.NOTIFICATION,
})
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @DefaultGet()
    @Authorize(PERMISSIONS_FRONT.NOTIFICATION.index)
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

    @DefaultGet('count')
    @Authorize(PERMISSIONS_FRONT.NOTIFICATION.edit)
    async countNotificationUnreadOfUser(@Req() req: { user: UserPayload }) {
        const { user } = req;

        const result =
            await this.notificationsService.countNotificationUnreadOfUser(user);
        return result;
    }

    @DefaultPut('read')
    @Authorize(PERMISSIONS_FRONT.NOTIFICATION.edit)
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

    @DefaultPut('read/all')
    @Authorize(PERMISSIONS_FRONT.NOTIFICATION.edit)
    async updateAllStatus(@Req() req: { user: UserPayload }) {
        const { user } = req;

        const result = await this.notificationsService.updateAllStatus(user);
        return result;
    }

    @DefaultDelete(':id')
    @Authorize(PERMISSIONS_FRONT.NOTIFICATION.destroy)
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
