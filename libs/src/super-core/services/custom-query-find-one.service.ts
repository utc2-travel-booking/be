import { Expression, Document, PipelineStage } from 'mongoose';
import { ICustomQueryFindOne } from './interfaces/custom-query-find-one.interface';
import { deleteAllLookup, sortPipelines } from '@libs/super-search';
import { SGetCache } from '@libs/super-cache';
import { CustomQueryBaseService } from 'libs/src/super-core/services/base-query.service';

export class CustomQueryFindOneService<T extends Document>
    extends CustomQueryBaseService<T>
    implements ICustomQueryFindOne<T>
{
    select(fields: Record<string, number>): this {
        this._pipeline.push({ $project: fields });
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
    async exec(): Promise<T> {
        let pipeline: PipelineStage[] = [
            { $match: { deletedAt: null, ...this._conditions } },
        ];

        if (this._pipeline.length) {
            pipeline.push(...this._pipeline);
        }

        pipeline = sortPipelines(pipeline);

        const result = await this.model.aggregate(pipeline).exec();
        return result?.length ? result[0] : null;
    }
}
