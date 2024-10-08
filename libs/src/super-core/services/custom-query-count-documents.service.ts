import { PipelineStage, Document, Expression } from 'mongoose';
import { SGetCache } from '../../super-cache';
import { ICustomQueryCountDocuments } from './interfaces/custom-query-count-documents.interface';
import _ from 'lodash';
import { deleteAllLookup, sortPipelines } from '@libs/super-search';
import { CustomQueryBaseService } from 'libs/src/super-core/services/base-query.service';

export class CustomQueryCountDocumentsService<T extends Document>
    extends CustomQueryBaseService<T>
    implements ICustomQueryCountDocuments
{
    select(fields: Record<string, number>): this {
        this._pipeline.push({ $project: fields });
        return this;
    }

    skip(value: number): this {
        this._pipeline.push({ $skip: value });
        return this;
    }

    limit(value: number): this {
        this._pipeline.push({ $limit: value });
        return this;
    }

    sort(sort: Record<string, 1 | -1 | Expression.Meta>): this {
        this._pipeline.push({ $sort: sort });
        return this;
    }

    autoPopulate(autoPopulate: boolean): this {
        if (!autoPopulate) {
            this._pipeline = deleteAllLookup(this._pipeline);
        }
        return this;
    }

    @SGetCache()
    async exec(): Promise<number> {
        let pipeline: PipelineStage[] = [
            { $match: { deletedAt: null, ...this._conditions } },
        ];

        if (this._pipeline.length) {
            pipeline.push(...this._pipeline);
        }

        pipeline.push({ $count: 'totalCount' });

        pipeline = sortPipelines(pipeline);

        const result = await this.model.aggregate(pipeline).exec();
        return _.get(result, '[0].totalCount', 0);
    }
}
