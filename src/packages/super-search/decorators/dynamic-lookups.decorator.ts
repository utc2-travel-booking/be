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

            const _pipeline = dynamicLookupAggregates(this.entity);

            const updatedArgs = [filter, [..._pipeline, ...(pipeline || [])]];

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
