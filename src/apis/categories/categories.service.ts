import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { Category, CategoryDocument } from './entities/categories.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, Types } from 'mongoose';
import { UpdateCategoryDto } from './dto/update-categories.dto';
import { UserPayload } from 'src/base/models/user-payload.model';
import { ModuleRef } from '@nestjs/core';
import { CreateCategoryDto } from './dto/create-categories.dto';

@Injectable()
export class CategoriesService extends BaseService<CategoryDocument, Category> {
    constructor(
        @InjectModel(COLLECTION_NAMES.CATEGORIES)
        private readonly categoryModel: Model<CategoryDocument>,
        moduleRef: ModuleRef,
    ) {
        super(categoryModel, Category, COLLECTION_NAMES.CATEGORIES, moduleRef);
    }

    async createOne(
        createCategoryDto: CreateCategoryDto,
        user: UserPayload,
        options?: Record<string, any>,
    ) {
        const { _id: userId } = user;
        const { position } = createCategoryDto;

        await this.updatePosition(position);

        const result = new this.model({
            ...createCategoryDto,
            ...options,
            createdBy: userId,
        });
        await this.create(result);

        return result;
    }

    async updateOneById(
        _id: Types.ObjectId,
        updateCategoryDto: UpdateCategoryDto,
        user: UserPayload,
        options?: Record<string, any>,
    ) {
        const { _id: userId } = user;
        const { position } = updateCategoryDto;

        await this.updatePosition(position);

        const result = await this.findOneAndUpdate(
            { _id },
            { ...updateCategoryDto, ...options, updatedBy: userId },
            { new: true },
        );

        if (!result) {
            throw new BadRequestException(`Not found ${_id}`);
        }

        return result;
    }

    async deleteManyByIdsAndType(
        _ids: Types.ObjectId[],
        type: string,
        user: UserPayload,
    ) {
        const { _id: userId } = user;
        const condition = {
            $or: [{ _id: { $in: _ids } }, { parent: { $in: _ids } }],
            deletedAt: null,
            type,
        };

        const data = await this.categoryModel.find(condition);

        await this.categoryModel.updateMany(condition, {
            deletedAt: new Date(),
            deletedBy: userId,
        });

        return data;
    }

    async updateOneByIdAndType(
        _id: Types.ObjectId,
        type: string,
        updateCategoryDto: UpdateCategoryDto,
        user: UserPayload,
    ) {
        const { _id: userId } = user;

        const result = await this.findOneAndUpdate(
            { _id, type },
            { ...updateCategoryDto, updatedBy: userId },
            { new: true },
        );

        if (!result) {
            throw new BadRequestException('Category not found');
        }

        return result;
    }

    private async updatePosition(position: number, thisId?: Types.ObjectId) {
        const category = await this.findOne({
            position,
            _id: { $ne: thisId },
        })
            .autoPopulate(false)
            .exec();

        if (category) {
            position++;

            const _tagApp = await this.model.findOneAndUpdate(
                { _id: new Types.ObjectId(category?._id) },
                { position },
                { new: true },
            );

            await this.updatePosition(position, _tagApp._id);
        }
    }
}
