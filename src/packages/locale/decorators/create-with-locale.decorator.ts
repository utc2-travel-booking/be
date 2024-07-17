import { createDocumentLocale } from '../common/create.utils';

export function CreateWithLocale() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const [doc, locale] = args;
            await createDocumentLocale(this.entity, doc, locale);
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
