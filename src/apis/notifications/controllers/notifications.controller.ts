import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Put,
    Query,
    Req,
} from '@nestjs/common';
import { NotificationsService } from '../notifications.service';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Authorize } from 'src/decorators/authorize.decorator';
import { PERMISSIONS_FRONT } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { UserPayload } from 'src/base/models/user-payload.model';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { UpdateStatusNotificationDto } from '../dto/update-status-notifications.dto';

@Controller('notifications')
@ApiTags('Front: Notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) {}

    @Get()
    @ApiBearerAuth()
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

    @Put('read')
    @ApiBearerAuth()
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

    @Delete(':id')
    @ApiBearerAuth()
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
