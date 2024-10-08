import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { MetadataDocument } from './entities/metadata.entity';
import { COLLECTION_NAMES } from 'src/constants';
import { ExtendedInjectModel } from '@libs/super-core';
import { ExtendedModel } from '@libs/super-core/interfaces/extended-model.interface';

@Injectable()
export class MetadataService extends BaseService<MetadataDocument> {
    constructor(
        @ExtendedInjectModel(COLLECTION_NAMES.METADATA)
        private readonly metadataModel: ExtendedModel<MetadataDocument>,
    ) {
        super(metadataModel);
    }
}
