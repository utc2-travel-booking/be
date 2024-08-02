import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { App, AppDocument } from './entities/apps.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AppsService extends BaseService<AppDocument, App> {
    constructor(
        @InjectModel(COLLECTION_NAMES.APP)
        private readonly appModel: Model<AppDocument>,
        eventEmitter: EventEmitter2,
    ) {
        super(appModel, App, COLLECTION_NAMES.APP, eventEmitter);
    }
}
