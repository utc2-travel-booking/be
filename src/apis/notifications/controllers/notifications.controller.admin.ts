import { Query } from '@nestjs/common';
import { NotificationsService } from '../notifications.service';
import { ApiTags } from '@nestjs/swagger';
import { COLLECTION_NAMES } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { ExtendedGet } from '@libs/super-core/decorators/extended-get.decorator';
import { SuperController } from '@libs/super-core';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';

@SuperController('notifications')
@ApiTags('Admin: Notifications')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.NOTIFICATION,
})
export class NotificationsControllerAdmin {
    constructor(private readonly notificationsService: NotificationsService) {}

    @ExtendedGet()
    @SuperAuthorize()
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.notificationsService.getAll(queryParams);
        return result;
    }
}
