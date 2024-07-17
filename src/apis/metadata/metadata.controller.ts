import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MetadataService } from './metadata.service';

@Controller('metadata')
@ApiTags('Front: Metadata')
export class MetadataController {
    constructor(private readonly metadataService: MetadataService) {}
}
