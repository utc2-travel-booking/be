import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/base/service/base.service';
import { Category, CategoryDocument } from './entities/categories.entity';
import { InjectModel } from '@nestjs/mongoose';
import { COLLECTION_NAMES } from 'src/constants';
import { Model, Types } from 'mongoose';
import { UpdateCategoryDto } from './dto/update-categories.dto';
import { UserPayload } from 'src/base/models/user-payload.model';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class CategoriesService extends BaseService<CategoryDocument, Category> {
    constructor(
        @InjectModel(COLLECTION_NAMES.CATEGORIES)
        private readonly categoryModel: Model<CategoryDocument>,
        moduleRef: ModuleRef,
    ) {
        super(categoryModel, Category, COLLECTION_NAMES.CATEGORIES, moduleRef);
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
}
