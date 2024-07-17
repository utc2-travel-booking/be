import { updateDocumentLocale } from '../common/update.utils';

export function UpdateWithLocale() {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const [filter, update, options, locale] = args;
            await updateDocumentLocale(
                this.model,
                this.entity,
                filter,
                update,
                locale,
            );
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}
