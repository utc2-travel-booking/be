import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Post, PostDocument } from './entities/posts.entity';
import { BaseService } from 'src/base/service/base.service';
import { UpdatePostDto } from './dto/update-posts.dto';
import { UserPayload } from 'src/base/models/user-payload.model';
import { CreatePostDto } from './dto/create-posts.dto';
import { removeDiacritics } from 'src/utils/helper';
import _ from 'lodash';
import { PostType } from './constants';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class PostsService extends BaseService<PostDocument, Post> {
    constructor(
        @InjectModel(COLLECTION_NAMES.POST)
        private readonly postModel: Model<PostDocument>,
        moduleRef: ModuleRef,
    ) {
        super(postModel, Post, COLLECTION_NAMES.POST, moduleRef);
    }

    async createByType(
        createPostDto: CreatePostDto,
        type: PostType,
        user: UserPayload,
        options?: Record<string, any>,
    ) {
        const { name } = createPostDto;
        const slug = _.kebabCase(removeDiacritics(name));

        const existed = await this.postModel.exists({
            type,
            slug,
            deletedAt: null,
        });

        if (existed) {
            throw new BadRequestException('Post name already exists');
        }

        const result = new this.postModel({
            ...createPostDto,
            ...options,
            name,
            type,
            slug,
            createdBy: user._id,
        });

        await this.create(result);
        return result;
    }

    async updateOneByIdAndType(
        _id: Types.ObjectId,
        type: PostType,
        updatePostDto: UpdatePostDto,
        user: UserPayload,
    ) {
        const { _id: userId } = user;

        const result = await this.findOneAndUpdate(
            { _id, type },
            { ...updatePostDto, updatedBy: userId },
            { new: true },
        );

        if (!result) {
            throw new BadRequestException('Post not found');
        }

        return result;
    }

    async deleteManyByIdsAndType(
        _ids: Types.ObjectId[],
        type: string,
        user: UserPayload,
    ) {
        const { _id: userId } = user;
        const data = await this.postModel.find({ _id: { $in: _ids }, type });

        await this.updateMany(
            { _id: { $in: _ids }, type },
            { deletedAt: new Date(), deletedBy: userId },
        );

        return data;
    }
}
