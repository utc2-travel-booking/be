import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { COLLECTION_NAMES } from 'src/constants';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { MetadataService } from '../metadata.service';

@Controller('metadata')
@ApiTags('Front: Metadata')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.METADATA,
})
export class MetadataController {
    constructor(private readonly metadataService: MetadataService) {}
}
