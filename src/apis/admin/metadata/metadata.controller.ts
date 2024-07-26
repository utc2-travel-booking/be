import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MetadataService } from 'src/apis/metadata/metadata.service';
import { COLLECTION_NAMES } from 'src/constants';
import { AUDIT_EVENT } from 'src/packages/audits/constants';
import { AuditLog } from 'src/packages/audits/decorators/audits.decorator';
import { SuperCache } from 'src/packages/super-cache/decorators/super-cache.decorator';

@Controller('metadata')
@ApiTags('Admin: Metadata')
@SuperCache({
    mainCollectionName: COLLECTION_NAMES.METADATA,
    relationCollectionNames: [COLLECTION_NAMES.USER],
})
@AuditLog({
    events: [
        AUDIT_EVENT.GET,
        AUDIT_EVENT.POST,
        AUDIT_EVENT.PUT,
        AUDIT_EVENT.DELETE,
    ],
    refSource: COLLECTION_NAMES.METADATA,
})
export class MetadataController {
    constructor(private readonly metadataService: MetadataService) {}
}
