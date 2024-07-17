import { BadRequestException, Injectable } from '@nestjs/common';
import {
    Document,
    FilterQuery,
    Model,
    PipelineStage,
    ProjectionType,
    QueryOptions,
    Types,
    UpdateQuery,
    UpdateWithAggregationPipeline,
} from 'mongoose';
import { ExtendedPagingDto } from 'src/pipes/page-result.dto.pipe';
import {
    DynamicLookup,
    pagination,
    projectionConfig,
} from 'src/packages/super-search';
import { UserPayload } from '../models/user-payload.model';
import { activePublications } from '../aggregates/active-publications.aggregates';
import _ from 'lodash';
import {
    CreateWithLocale,
    FindWithLocale,
    UpdateWithLocale,
} from 'src/packages/locale';

@Injectable()
export class BaseService<T extends Document, E> {
    constructor(
        private readonly model: Model<T>,
        private readonly entity: new () => E,
    ) {}

    async getAll(
        queryParams: ExtendedPagingDto<T>,
        options?: Record<string, any>,
        locale?: string,
    ) {
        const { page, limit, sortBy, sortDirection, skip, filterPipeline } =
            queryParams;

        const result = this.find(
            {
                ...options,
                deletedAt: null,
            },
            null,
            { limit, skip, sort: { [sortBy]: sortDirection } },
            filterPipeline,
            locale,
        );

        const total = this.countDocuments(
            {
                ...options,
                deletedAt: null,
            },
            null,
            filterPipeline,
        );

        return Promise.all([result, total]).then(([items, total]) => {
            const totalCount = _.get(total, 'total[0].totalCount', 0);
            const meta = pagination(items, page, limit, totalCount);
            return { items, meta };
        });
    }

    async getOne(
        _id: Types.ObjectId,
        options?: Record<string, any>,
        locale?: string,
    ) {
        const result = await this.findOne(
            {
                _id,
                ...options,
                deletedAt: null,
            },
            null,
            null,
            [],
            locale,
        );

        return result;
    }

    async createOne(
        payload: any,
        user: UserPayload,
        options?: Record<string, any>,
        locale?: string,
    ) {
        const { _id: userId } = user;

        const result = new this.model({
            ...payload,
            ...options,
            createdBy: userId,
        });
        await this.create(result, locale);

        return result;
    }

    async deletes(_ids: Types.ObjectId[], user: UserPayload) {
        const { _id: userId } = user;

        const data = await this.model.find({ _id: { $in: _ids } });

        await this.model.updateMany(
            { _id: { $in: _ids } },
            { deletedAt: new Date(), deletedBy: userId },
        );

        return data;
    }

    async updateOneById(
        _id: Types.ObjectId,
        payload: any,
        user: UserPayload,
        locale?: string,
    ) {
        const { _id: userId } = user;
        const result = await this.findOneAndUpdate(
            { _id },
            { ...payload, updatedBy: userId },
            { new: true },
            locale,
        );

        if (!result) {
            throw new BadRequestException(`Not found ${_id}`);
        }

        return result;
    }

    async getAllForFront(
        queryParams: ExtendedPagingDto<T>,
        options?: Record<string, any>,
        locale?: string,
    ) {
        const { page, limit, sortBy, sortDirection, skip, filterPipeline } =
            queryParams;

        activePublications(queryParams.filterPipeline);

        const result = this.find(
            { deletedAt: null, ...options },
            '-longDescription',
            { limit, skip, sort: { [sortBy]: sortDirection } },
            filterPipeline,
            locale,
        );

        const total = this.countDocuments(
            {
                deletedAt: null,
                ...options,
            },
            null,
            filterPipeline,
        );
        return Promise.all([result, total]).then(([items, total]) => {
            const totalCount = _.get(total, 'total[0].totalCount', 0);
            const meta = pagination(items, page, limit, totalCount);
            return { items, meta };
        });
    }

    async getOneByIdForFront(
        _id: Types.ObjectId,
        options?: Record<string, any>,
        locale?: string,
    ) {
        // const currentDate = dayjs().toDate();
        // const result = await this.findOne({
        //     _id,
        //     deletedAt: null,
        //     $or: activePublications(currentDate),
        //     ...options,
        // });
        // return result;
    }

    async findById(
        id: any,
        projection?: ProjectionType<T> | null,
        options?: QueryOptions<T> | null,
    ) {
        return this.model.findById(id, projection, options);
    }

    @CreateWithLocale()
    async create(doc: Partial<T>, locale?: string): Promise<T> {
        return await this.model.create(doc);
    }

    async createMany<DTO>(arrData: Array<DTO>) {
        return await this.model.insertMany(arrData);
    }

    async updateMany<UpdateDto extends T>(
        filter: FilterQuery<T>,
        arrData: Array<UpdateDto>,
    ) {
        return await this.model.updateMany({ ...filter }, arrData);
    }

    async delete(filter: FilterQuery<T>) {
        return await this.model.updateOne(filter, {
            isDeleted: true,
        });
    }

    async unDelete(filter: FilterQuery<T>) {
        return this.model.updateMany(filter, {
            isDeleted: false,
        });
    }

    async hardDeleteOne(filter: FilterQuery<T>) {
        return this.model.deleteOne(filter);
    }

    async getOneAndUpdate<UpdateDto extends T>(
        filter: FilterQuery<T>,
        data: any,
        options: QueryOptions<T> = {},
    ) {
        return this.model.findOneAndUpdate(filter, data, options);
    }

    insertOne(data: Partial<Record<keyof T, unknown>>) {
        return this.model.create(data);
    }

    @FindWithLocale()
    @DynamicLookup()
    find(
        filter: FilterQuery<T>,
        projection?: ProjectionType<T> | null | undefined,
        options?: QueryOptions<T> | null | undefined,
        filterPipeline?: PipelineStage[],
        locale?: string,
    ) {
        const { limit, skip, sort } = options || {};
        const pipeline: PipelineStage[] = [];

        if (filter) {
            pipeline.push({ $match: filter });
        }

        if (sort) {
            pipeline.push({ $sort: sort });
        }

        if (limit) {
            pipeline.push({ $limit: limit });
        }

        if (skip) {
            pipeline.push({ $skip: skip });
        }

        if (projection) {
            projectionConfig(pipeline, projection);
        }

        if (filterPipeline && filterPipeline.length) {
            pipeline.push(...filterPipeline);
        }

        return this.model.aggregate(pipeline).exec();
    }

    @FindWithLocale()
    @DynamicLookup()
    async findOne(
        filter?: FilterQuery<T>,
        projection?: ProjectionType<T> | null,
        options?: QueryOptions<T> | null,
        pipeline: PipelineStage[] = [],
        locale?: string,
    ): Promise<T | null> {
        const { sort } = options;
        if (filter) {
            pipeline.push({ $match: filter });
        }

        if (projection) {
            projectionConfig(pipeline, projection);
        }

        if (sort) {
            pipeline.push({ $sort: sort });
        }

        return this.model
            .aggregate(pipeline)
            .exec()
            .then((result) => result[0]);
    }

    countDocuments(
        filter?: FilterQuery<T>,
        options?: QueryOptions<T>,
        filterPipeline?: PipelineStage[],
    ) {
        const pipeline: PipelineStage[] = [];

        if (filter) {
            pipeline.push({ $match: filter });
        }

        if (filterPipeline && filterPipeline.length) {
            pipeline.push(...filterPipeline);
        }

        pipeline.push({ $count: 'totalCount' });

        return this.model.aggregate(pipeline).exec();
    }

    @UpdateWithLocale()
    async updateOne(
        filter?: FilterQuery<T>,
        update?: UpdateQuery<T> | UpdateWithAggregationPipeline,
        options?: QueryOptions<T> | null,
        locale?: string,
    ) {
        return await this.model.updateOne(filter, update, options);
    }

    @UpdateWithLocale()
    async findOneAndUpdate(
        filter?: FilterQuery<T>,
        update?: UpdateQuery<T>,
        options?: QueryOptions<T> | null,
        locale?: string,
    ) {
        return this.model.findOneAndUpdate(filter, update, options);
    }

    findByIdAndUpdate(
        id: Types.ObjectId | any,
        update: UpdateQuery<T>,
        options: QueryOptions<T> = {},
        locale?: string,
    ) {
        return this.model.findByIdAndUpdate(id, update, options);
    }

    deleteOne(filter: FilterQuery<T>) {
        return this.model.deleteOne(filter);
    }

    deleteMany(filter: FilterQuery<T>) {
        return this.model.deleteMany(filter);
    }

    findByIdAndDelete(id: any, options: QueryOptions<T> = {}) {
        return this.model.findByIdAndDelete(id, options);
    }
}
