import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { PageDocument } from './entities/pages.entity';
import { COLLECTION_NAMES } from 'src/constants';
import { ExtendedInjectModel } from '@libs/super-core';
import { ExtendedModel } from '@libs/super-core/interfaces/extended-model.interface';

@Injectable()
export class PagesService extends BaseService<PageDocument> {
    constructor(
        @ExtendedInjectModel(COLLECTION_NAMES.PAGE)
        private readonly pagesModel: ExtendedModel<PageDocument>,
    ) {
        super(pagesModel);
    }
}
