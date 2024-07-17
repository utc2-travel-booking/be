import { findDocumentLocale } from '../common/find.utils';

export function FindWithLocale() {
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

            findDocumentLocale(this.entity, pipeline, locale);

            const updatedArgs = [filter, projection, options, pipeline, locale];
            return originalMethod.apply(this, updatedArgs);
        };

        return descriptor;
    };
}
