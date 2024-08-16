import { Body, Controller, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { COLLECTION_NAMES, PERMISSIONS_FRONT } from 'src/constants';
import { Types } from 'mongoose';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { FormBuilderService } from '../form-builders.service';
import { DefaultPost } from 'src/base/controllers/base.controller';
import { Authorize } from 'src/decorators/authorize.decorator';
import { CreateFormBuildersDto } from '../dto/create-form-builders.dto';
import { UserPayload } from 'src/base/models/user-payload.model';
import { removeDiacritics } from 'src/utils/helper';
import _ from 'lodash';

@Controller('form-builder')
@ApiTags('Front: Form Builder')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.FORM_BUILDER,
})
export class ContactUsController {
    constructor(private readonly contactUsService: FormBuilderService) {}

    @DefaultPost()
    async create(@Body() createFormBuilderDto: CreateFormBuildersDto) {
        const result = await this.contactUsService.createOne(
            createFormBuilderDto,
        );

        return result;
    }
}
