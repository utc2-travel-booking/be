import { FindMongooseModel } from 'src/base/models/find-mongoose.model';
import { findDocumentLocale } from '../common/find.utils';

export function FindWithLocale() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const [option] = args;
            const { filterPipeline, locale } = option as FindMongooseModel<any>;

            const pipeline = Array.isArray(filterPipeline)
                ? filterPipeline
                : [];

            findDocumentLocale(this.entity, pipeline, locale);

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
