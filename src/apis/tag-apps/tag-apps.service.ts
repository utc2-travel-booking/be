import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { TagApp, TagAppDocument } from './entities/tag-apps.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model } from 'mongoose';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class TagAppsService extends BaseService<TagAppDocument, TagApp> {
    constructor(
        @InjectModel(COLLECTION_NAMES.TAG_APP)
        private readonly tagAppModel: Model<TagAppDocument>,
        moduleRef: ModuleRef,
    ) {
        super(tagAppModel, TagApp, COLLECTION_NAMES.TAG_APP, moduleRef);
    }
}
