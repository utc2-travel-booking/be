import { dynamicLookupAggregates } from '../aggregates';

export function DynamicLookup() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const [filter, projection, options, filterPipeline, locale] = args;

            const pipeline = Array.isArray(filterPipeline)
                ? filterPipeline
                : [];

            dynamicLookupAggregates(pipeline, this.entity);

            const updatedArgs = [filter, projection, options, pipeline, locale];
            return originalMethod.apply(this, updatedArgs);
        };

        return descriptor;
    };
}
