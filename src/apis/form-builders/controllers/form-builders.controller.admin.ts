import { Controller, Param, Query, Req } from '@nestjs/common';
import { ApiParam, ApiTags, ApiQuery } from '@nestjs/swagger';
import { COLLECTION_NAMES, PERMISSIONS } from 'src/constants';
import {
    ExtendedPagingDto,
    PagingDtoPipe,
} from 'src/pipes/page-result.dto.pipe';
import { ParseObjectIdPipe } from 'src/pipes/parse-object-id.pipe';
import { Types } from 'mongoose';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { FormBuilderService } from '../form-builders.service';
import { FormBuilderType } from '../constants';
import {
    DefaultDelete,
    DefaultGet,
} from 'src/base/controllers/base.controller';
import { Authorize } from 'src/decorators/authorize.decorator';
import { ParseObjectIdArrayPipe } from 'src/pipes/parse-object-ids.pipe';
import { UserPayload } from 'src/base/models/user-payload.model';

@Controller('form-builders')
@ApiTags('Admin: Form Builder')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.FORM_BUILDER,
})
export class FormBuilderControllerAdmin {
    constructor(private readonly formBuilderService: FormBuilderService) {}

    @DefaultGet('')
    @Authorize(PERMISSIONS.FORM_BUILDER.index)
    async getAll(
        @Query(new PagingDtoPipe())
        queryParams: ExtendedPagingDto,
    ) {
        const result = await this.formBuilderService.getAll(queryParams);
        return result;
    }

    @DefaultGet(':id')
    @Authorize(PERMISSIONS.FORM_BUILDER.index)
    @ApiParam({ name: 'id', type: String })
    async getOne(@Param('id', ParseObjectIdPipe) _id: Types.ObjectId) {
        const result = await this.formBuilderService.getOne(_id);
        return result;
    }

    @DefaultDelete()
    @Authorize(PERMISSIONS.FORM_BUILDER.destroy)
    @ApiQuery({ name: 'ids', type: [String] })
    async deletes(
        @Query('ids', ParseObjectIdArrayPipe) _ids: Types.ObjectId[],
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;

        const result = await this.formBuilderService.deletes(_ids, user);
        return result;
    }
}
