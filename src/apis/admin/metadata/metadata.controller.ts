import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MetadataService } from 'src/apis/metadata/metadata.service';

@Controller('metadata')
@ApiTags('Admin: Metadata')
export class MetadataController {
    constructor(private readonly metadataService: MetadataService) {}
}
