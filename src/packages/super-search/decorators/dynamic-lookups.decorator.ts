import { FindMongooseModel } from 'src/base/models/find-mongoose.model';
import { dynamicLookupAggregates } from '../aggregates';

export function DynamicLookup() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const [option] = args;
            const { filterPipeline } = option as FindMongooseModel<any>;

            const pipeline = Array.isArray(filterPipeline)
                ? filterPipeline
                : [];

            dynamicLookupAggregates(pipeline, this.entity);

            const updatedArgs = [
                {
                    ...option,
                    filterPipeline: pipeline,
                },
            ];
            return originalMethod.apply(this, updatedArgs);
        };

        return descriptor;
    };
}
