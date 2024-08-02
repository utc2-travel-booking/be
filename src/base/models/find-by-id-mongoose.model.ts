import { PipelineStage, ProjectionType, QueryOptions } from 'mongoose';

export class FindByIdMongooseModel<T> {
    id: any;
    projection?: ProjectionType<T> | null | undefined;
    options?: QueryOptions<T> | null | undefined;
    filterPipeline?: PipelineStage[];
}
