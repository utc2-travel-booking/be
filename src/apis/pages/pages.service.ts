import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/_base.service';
import { Pages, PagesDocument } from './entities/pages.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { ModuleRef } from '@nestjs/core';
import { Model } from 'mongoose';

@Injectable()
export class PagesService extends BaseService<PagesDocument, Pages> {
    constructor(
        @InjectModel(COLLECTION_NAMES.PAGE)
        private readonly pagesModel: Model<PagesDocument>,
        moduleRef: ModuleRef,
    ) {
        super(pagesModel, Pages, COLLECTION_NAMES.PAGE, moduleRef);
    }
}
