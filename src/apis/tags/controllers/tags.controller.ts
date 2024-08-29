import { ApiTags } from '@nestjs/swagger';
import { TagsService } from '../tags.service';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { COLLECTION_NAMES } from 'src/constants';
import { Controller } from '@nestjs/common';
import { Resource } from '@libs/super-authorize';

@Controller('tags')
@Resource('tags')
@ApiTags('Front: Tags')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.TAG,
})
export class TagsController {
    constructor(private readonly tagsService: TagsService) {}
}
