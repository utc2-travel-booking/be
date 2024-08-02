import {
    FilterQuery,
    PipelineStage,
    ProjectionType,
    QueryOptions,
} from 'mongoose';

export class FindMongooseModel<T> {
    filter: FilterQuery<T>;
    projection?: ProjectionType<T> | null | undefined;
    options?: QueryOptions<T> | null | undefined;
    filterPipeline?: PipelineStage[];
}
