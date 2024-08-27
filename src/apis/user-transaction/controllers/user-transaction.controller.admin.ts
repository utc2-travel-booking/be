import { Param, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { UserTransactionService } from 'src/apis/user-transaction/user-transaction.service';
import { COLLECTION_NAMES } from 'src/constants';
import {
    PagingDtoPipe,
    ExtendedPagingDto,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { ExtendedGet } from '@libs/super-core/decorators/extended-get.decorator';
import { SuperController } from '@libs/super-core';
import { SuperAuthorize } from '@libs/super-authorize/decorators/authorize.decorator';

@SuperController('user-transactions')
@ApiTags('Admin: User Transactions')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.USER_TRANSACTION,
})
export class UserTransactionControllerAdmin {
    constructor(
        private readonly userTransactionService: UserTransactionService,
    ) {}

    @ExtendedGet()
    @ApiBearerAuth()
    @SuperAuthorize()
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.userTransactionService.getAll(queryParams);
        return result;
    }

    @ExtendedGet({ route: ':id' })
    @ApiBearerAuth()
    @SuperAuthorize()
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.userTransactionService.getOne(_id);
        return result;
    }
}
