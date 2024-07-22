import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MetadataService } from 'src/apis/metadata/metadata.service';
import { COLLECTION_NAMES } from 'src/constants';
import { SuperCache } from 'src/packages/super-cache/decorators/super-cache.decorator';

@Controller('metadata')
@ApiTags('Admin: Metadata')
@SuperCache({
    mainCollectionName: COLLECTION_NAMES.METADATA,
    relationCollectionNames: [COLLECTION_NAMES.USER],
})
export class MetadataController {
    constructor(private readonly metadataService: MetadataService) {}
}
