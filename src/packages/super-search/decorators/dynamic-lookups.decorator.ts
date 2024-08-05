import { PipelineStage } from 'mongoose';
import { dynamicLookupAggregates } from '../aggregates';

export function DynamicLookup() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = function (...args: any[]) {
            const [filter, pipeline] = args;

            const _pipeline: PipelineStage[] = Array.isArray(pipeline)
                ? [...pipeline]
                : [];

            dynamicLookupAggregates(_pipeline, this.entity);

            const updatedArgs = [filter, _pipeline];

            try {
                const result = originalMethod.apply(this, updatedArgs);
                return result;
            } catch (error) {
                throw error;
            }
        };

        return descriptor;
    };
}
