import { Controller, Query } from '@nestjs/common';
import { NotificationsService } from '../notifications.service';
import { ApiTags } from '@nestjs/swagger';
import { DefaultGet } from 'src/base/controllers/base.controller';
import { Authorize } from 'src/decorators/authorize.decorator';
import { COLLECTION_NAMES, PERMISSIONS } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';

@Controller('notifications')
@ApiTags('Admin: Notifications')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.NOTIFICATION,
})
export class NotificationsControllerAdmin {
    constructor(private readonly notificationsService: NotificationsService) {}

    @DefaultGet()
    @Authorize(PERMISSIONS.NOTIFICATION.index)
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.notificationsService.getAll(queryParams);
        return result;
    }
}
