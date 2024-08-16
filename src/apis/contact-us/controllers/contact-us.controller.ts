import { Body, Controller, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { COLLECTION_NAMES, PERMISSIONS_FRONT } from 'src/constants';
import { Types } from 'mongoose';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { ContactUsService } from '../contact-us.service';
import { DefaultPost } from 'src/base/controllers/base.controller';
import { Authorize } from 'src/decorators/authorize.decorator';
import { CreateContactUsDto } from '../dto/create-contact-us.dto';
import { UserPayload } from 'src/base/models/user-payload.model';
import { removeDiacritics } from 'src/utils/helper';
import _ from 'lodash';

@Controller('contact-us')
@ApiTags('Front: Contact Us')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.CONTACT_US,
})
export class ContactUsController {
    constructor(private readonly contactUsService: ContactUsService) {}

    @DefaultPost()
    @Authorize(PERMISSIONS_FRONT.CONTACT_US.create)
    async create(
        @Body() createContactUsDto: CreateContactUsDto,
        @Req() req: { user: UserPayload },
    ) {
        const { user } = req;
        const { name } = createContactUsDto;

        const result = await this.contactUsService.createOne(
            createContactUsDto,
            user,
            { slug: _.kebabCase(removeDiacritics(name)) },
        );

        return result;
    }
}
