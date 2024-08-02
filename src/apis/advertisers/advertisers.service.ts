import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { Advertiser, AdvertiserDocument } from './entities/advertisers.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AdvertisersService extends BaseService<
    AdvertiserDocument,
    Advertiser
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.ADVERTISER)
        private readonly advertiserDocument: Model<AdvertiserDocument>,
        eventEmitter: EventEmitter2,
    ) {
        super(
            advertiserDocument,
            Advertiser,
            COLLECTION_NAMES.ADVERTISER,
            eventEmitter,
        );
    }
}
