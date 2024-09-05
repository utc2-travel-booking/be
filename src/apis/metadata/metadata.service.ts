import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { Metadata, MetadataDocument } from './entities/metadata.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model } from 'mongoose';
import { SuperCacheService } from '@libs/super-cache/super-cache.service';
import { ModuleRef } from '@nestjs/core';
import { MetadataType } from './constants';
import { AmountRewardUserModel } from './models/amount-reward-user.model';

@Injectable()
export class MetadataService extends BaseService<MetadataDocument, Metadata> {
    constructor(
        @InjectModel(COLLECTION_NAMES.METADATA)
        private readonly metadataModel: Model<MetadataDocument>,
        private readonly SuperCacheService: SuperCacheService,
        moduleRef: ModuleRef,
    ) {
        super(metadataModel, Metadata, COLLECTION_NAMES.METADATA, moduleRef);
    }

    async getAmountRewardUserForApp(
        type: MetadataType,
    ): Promise<AmountRewardUserModel> {
        const result = await this.findOne({ type }).exec();
        return result;
    }
    async getAmountRewardReferral(): Promise<MetadataDocument> {
        const metadata = await this.findOne({
            type: MetadataType.AMOUNT_REFERRAL_REWARD,
        }).exec();

        return metadata;
    }
}
