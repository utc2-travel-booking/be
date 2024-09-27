import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { Tag, TagDocument } from './entities/tags.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model } from 'mongoose';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class TagsService extends BaseService<TagDocument, Tag> {
    constructor(
        @InjectModel(COLLECTION_NAMES.TAG)
        private readonly tagModel: Model<TagDocument>,
        moduleRef: ModuleRef,
    ) {
        super(tagModel, Tag, COLLECTION_NAMES.TAG, moduleRef);
    }

    async getOneBySlug(
        slug: string,
        options?: Record<string, any>,
    ): Promise<any> {
        const result = await this.findOne({
            slug,
            ...options,
        }).exec();

        if (!result) {
            throw new NotFoundException('tag_not_found', 'Tag not found');
        }

        return result;
    }
}
