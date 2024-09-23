import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { Metadata, MetadataDocument } from './entities/metadata.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model } from 'mongoose';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class MetadataService extends BaseService<MetadataDocument, Metadata> {
    constructor(
        @InjectModel(COLLECTION_NAMES.METADATA)
        private readonly metadataModel: Model<MetadataDocument>,
        moduleRef: ModuleRef,
    ) {
        super(metadataModel, Metadata, COLLECTION_NAMES.METADATA, moduleRef);
    }
}
