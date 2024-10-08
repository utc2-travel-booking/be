import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/_base.service';
import { TagApp, TagAppDocument } from './entities/tag-apps.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, Types } from 'mongoose';
import { ModuleRef } from '@nestjs/core';
import { UserPayload } from 'src/base/models/user-payload.model';
import { CreateTagAppDto } from './dto/create-tag-apps.dto';
import { UpdateTagAppDto } from './dto/update-tag-apps.dto';

@Injectable()
export class TagAppsService extends BaseService<TagAppDocument, TagApp> {
    constructor(
        @InjectModel(COLLECTION_NAMES.TAG_APP)
        private readonly tagAppModel: Model<TagAppDocument>,
        moduleRef: ModuleRef,
    ) {
        super(tagAppModel, TagApp, COLLECTION_NAMES.TAG_APP, moduleRef);
    }

    async createOne(
        createTagAppDto: CreateTagAppDto,
        user: UserPayload,
        options?: Record<string, any>,
    ) {
        const { _id: userId } = user;
        const { tag, app, position } = createTagAppDto;

        await this.uniqueTagApp(tag, app);

        await this.updatePosition(tag, position);

        const result = new this.model({
            ...createTagAppDto,
            ...options,
            createdBy: userId,
        });
        await this.create(result);

        return result;
    }

    async updateOneById(
        _id: Types.ObjectId,
        updateTagAppDto: UpdateTagAppDto,
        user: UserPayload,
        options?: Record<string, any>,
    ) {
        const { _id: userId } = user;

        await this.uniqueTagApp(updateTagAppDto.tag, updateTagAppDto.app, _id);
        await this.updatePosition(
            updateTagAppDto.tag,
            updateTagAppDto.position,
            _id,
        );

        const result = await this.findOneAndUpdate(
            { _id },
            { ...updateTagAppDto, ...options, updatedBy: userId },
        );

        if (!result) {
            throw new BadRequestException(`Not found ${_id}`);
        }

        return result;
    }

    private async uniqueTagApp(
        tag: Types.ObjectId,
        app: Types.ObjectId,
        thisId?: Types.ObjectId,
    ) {
        const tagApp = await this.findOne({
            tag,
            app,
            _id: { $ne: thisId },
        }).exec();

        if (tagApp) {
            throw new BadRequestException('Tag App already exists');
        }
    }

    private async updatePosition(
        tag: Types.ObjectId,
        position: number,
        thisId?: Types.ObjectId,
    ) {
        const tagApp = await this.findOne({
            tag,
            position,
            _id: { $ne: thisId },
        }).exec();

        if (tagApp) {
            position++;

            const _tagApp = await this.findOneAndUpdate(
                { _id: tagApp._id },
                { position },
            );

            await this.updatePosition(tag, position, _tagApp._id);
        }
    }
}
