import { BadRequestException, Injectable } from '@nestjs/common';
import { Document, FilterQuery, Model, PipelineStage, Types } from 'mongoose';
import { ExtendedPagingDto } from 'src/pipes/page-result.dto.pipe';
import { pagination } from 'src/packages/super-search';
import { UserPayload } from '../models/user-payload.model';
import { activePublications } from '../aggregates/active-publications.aggregates';
import _ from 'lodash';
import { COLLECTION_NAMES } from 'src/constants';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BaseRepositories } from '../repositories/base.repository';

@Injectable()
export class BaseService<T extends Document, E> extends BaseRepositories<T, E> {
    constructor(
        model: Model<T>,
        entity: new () => E,
        collectionName: COLLECTION_NAMES,
        eventEmitter: EventEmitter2,
    ) {
        if (!collectionName) {
            throw new Error('Collection name must be provided');
        }
        super(model, entity, collectionName, eventEmitter);
    }

    async getAll(
        queryParams: ExtendedPagingDto<T>,
        options?: Record<string, any>,
        locale?: string,
    ) {
        const { page, limit, sortBy, sortDirection, skip, filterPipeline } =
            queryParams;

        const total = this.countDocuments(
            {
                ...options,
                deletedAt: null,
            },
            null,
            filterPipeline,
        );

        const result = this.find({
            filter: {
                ...options,
                deletedAt: null,
            },
            options: { limit, skip, sort: { [sortBy]: sortDirection } },
            filterPipeline,
            locale,
        });

        return Promise.all([result, total]).then(([items, total]) => {
            const totalCount = _.get(total, '[0].totalCount', 0);
            const meta = pagination(items, page, limit, totalCount);
            return { items, meta };
        });
    }

    async getOne(
        _id: Types.ObjectId,
        options?: Record<string, any>,
        locale?: string,
    ): Promise<any> {
        const result = await this.findOne({
            filter: {
                _id,
                ...options,
                deletedAt: null,
            },
            locale,
        });

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

    async deletes(_ids: Types.ObjectId[], user: UserPayload): Promise<T[]> {
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

        const total = this.countDocuments(
            {
                deletedAt: null,
                ...options,
            },
            null,
            filterPipeline,
        );

        const result = this.find({
            filter: { deletedAt: null, ...options },
            projection: '-longDescription',
            options: { limit, skip, sort: { [sortBy]: sortDirection } },
            filterPipeline,
            locale,
        });

        return Promise.all([result, total]).then(([items, total]) => {
            const totalCount = _.get(total, '[0].totalCount', 0);
            const meta = pagination(items, page, limit, totalCount);
            return { items, meta };
        });
    }

    async getOneByIdForFront(
        _id: Types.ObjectId,
        options?: Record<string, any>,
        locale?: string,
    ) {
        const filterPipeline: PipelineStage[] = [];
        activePublications(filterPipeline);

        const result = await this.findOne({
            filter: {
                _id,
                deletedAt: null,
                ...options,
            },
            filterPipeline,
            locale,
        });

        return result;
    }

    async delete(filter: FilterQuery<T>) {
        return await this.model.updateOne(filter, {
            deletedAt: new Date(),
        });
    }

    async unDelete(filter: FilterQuery<T>) {
        return this.model.updateMany(filter, {
            deletedAt: null,
        });
    }
}
