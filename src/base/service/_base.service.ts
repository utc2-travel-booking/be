import { BadRequestException, Injectable } from '@nestjs/common';
import { FilterQuery, Model, Types } from 'mongoose';
import { ExtendedPagingDto } from 'src/pipes/page-result.dto.pipe';
import { pagination } from '@libs/super-search';
import { UserPayload } from '../models/user-payload.model';
import { activePublications } from '../aggregates/active-publications.aggregates';
import { COLLECTION_NAMES } from 'src/constants';
import { ModuleRef } from '@nestjs/core';
import { AggregateRoot } from '../entities/aggregate-root.schema';
import { removeDiacritics } from 'src/utils/helper';
import _ from 'lodash';
import { generateRandomString } from 'src/apis/users/common/generate-random-string.util';
import { BaseRepositories } from '@libs/super-core/modules/mongoose/repositories/base.repository';

@Injectable()
export class BaseService<T extends AggregateRoot, E> extends BaseRepositories<
    T,
    E
> {
    constructor(
        model: Model<T>,
        entity: new () => E,
        collectionName: COLLECTION_NAMES,
        moduleRef: ModuleRef,
    ) {
        if (!collectionName) {
            throw new Error('Collection name must be provided');
        }
        super(model, entity, collectionName, moduleRef);
    }

    async getAll(
        queryParams: ExtendedPagingDto,
        options?: Record<string, any>,
    ) {
        const {
            page,
            limit,
            sortBy,
            sortDirection,
            skip,
            filterPipeline,
            select,
        } = queryParams;

        const result = this.find(
            {
                ...options,
            },
            filterPipeline,
        )
            .limit(limit)
            .skip(skip)
            .sort({ [sortBy]: sortDirection })
            .select(select)
            .exec();

        const total = this.countDocuments(
            {
                ...options,
                deletedAt: null,
            },
            filterPipeline,
        ).exec();

        return Promise.all([result, total]).then(([items, total]) => {
            const meta = pagination(items, page, limit, total);
            return { items, meta };
        });
    }

    async getOne(
        _id: Types.ObjectId,
        options?: Record<string, any>,
    ): Promise<any> {
        const result = await this.findOne({
            $or: [{ _id }, { slug: _id }],
            ...options,
        }).exec();

        return result;
    }

    async createOne(
        payload: any,
        user: UserPayload,
        options?: Record<string, any>,
    ) {
        const { _id: userId } = user;

        const result = new this.model({
            ...payload,
            ...options,
            createdBy: userId,
        });
        await this.create(result);

        return result;
    }

    async deletes(_ids: Types.ObjectId[], user: UserPayload): Promise<T[]> {
        const { _id: userId } = user;
        const data = await this.find({ _id: { $in: _ids } }).exec();
        await this.updateMany(
            { _id: { $in: _ids } },
            { deletedAt: new Date(), deletedBy: userId },
        );
        return data;
    }

    async updateOneById(
        _id: Types.ObjectId,
        payload: any,
        user: UserPayload,
        options?: Record<string, any>,
    ) {
        const { _id: userId } = user;
        const result = await this.findOneAndUpdate(
            { _id },
            { ...payload, ...options, updatedBy: userId },
        );

        if (!result) {
            throw new BadRequestException(`Not found ${_id}`);
        }

        return result;
    }

    async getAllForFront(
        queryParams: ExtendedPagingDto,
        options?: Record<string, any>,
    ) {
        const { page, limit, sortBy, sortDirection, skip, filterPipeline } =
            queryParams;

        activePublications(queryParams.filterPipeline);

        const result = this.find(
            {
                deletedAt: null,
                ...options,
            },
            filterPipeline,
        )
            .limit(limit)
            .skip(skip)
            .sort({ [sortBy]: sortDirection })
            .select({ longDescription: 0 })
            .exec();

        const total = this.countDocuments(
            {
                deletedAt: null,
                ...options,
            },
            filterPipeline,
        ).exec();

        return Promise.all([result, total]).then(([items, total]) => {
            const meta = pagination(items, page, limit, total);
            return { items, meta };
        });
    }

    async delete(filter: FilterQuery<T>) {
        return await this.updateOne(filter, {
            deletedAt: new Date(),
        });
    }

    async unDelete(filter: FilterQuery<T>) {
        return this.updateMany(filter, {
            deletedAt: null,
        });
    }

    async generateSlug(name: string) {
        const slug = _.kebabCase(removeDiacritics(name));
        const exist = await this.findOne({ slug }).exec();

        if (exist) {
            return await this.generateSlug(
                `${slug}-${generateRandomString(2)}`,
            );
        }

        return slug;
    }
}
