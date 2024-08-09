import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { Advertiser, AdvertiserDocument } from './entities/advertisers.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, Types } from 'mongoose';
import { ModuleRef } from '@nestjs/core';
import { populateGroupBannerImageAggregate } from './common/populate-group-banner-image.aggregate';

@Injectable()
export class AdvertisersService extends BaseService<
    AdvertiserDocument,
    Advertiser
> {
    constructor(
        @InjectModel(COLLECTION_NAMES.ADVERTISER)
        private readonly advertiserDocument: Model<AdvertiserDocument>,
        moduleRef: ModuleRef,
    ) {
        super(
            advertiserDocument,
            Advertiser,
            COLLECTION_NAMES.ADVERTISER,
            moduleRef,
        );
    }

    async getOne(
        _id: Types.ObjectId,
        options?: Record<string, any>,
    ): Promise<any> {
        const result = await this.findOne(
            {
                _id,
                ...options,
            },
            populateGroupBannerImageAggregate,
        ).exec();

        return result;
    }
}
