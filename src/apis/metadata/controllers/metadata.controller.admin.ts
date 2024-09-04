import { Resource } from '@libs/super-authorize';
import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MetadataService } from 'src/apis/metadata/metadata.service';
import { COLLECTION_NAMES } from 'src/constants';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';

@Controller('metadata')
@Resource('metadata')
@ApiTags('Admin: Metadata')
@AuditLog({
    events: [AUDIT_EVENT.POST, AUDIT_EVENT.PUT, AUDIT_EVENT.DELETE],
    refSource: COLLECTION_NAMES.METADATA,
})
export class MetadataControllerAdmin {
    constructor(private readonly metadataService: MetadataService) {}
}
