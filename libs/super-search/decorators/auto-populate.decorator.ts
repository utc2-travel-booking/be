import { AutoPopulateMetadataStorage } from '../storages/auto-populate-metadata.storage';

export type AutoPopulateOptions = {
    ref: string;
    isArray?: boolean;
};

export function AutoPopulate(
    autoPopulateOptions: AutoPopulateOptions,
): PropertyDecorator {
    const { ref, isArray = false } = autoPopulateOptions;
    return (target: object, propertyKey: string | symbol) => {
        AutoPopulateMetadataStorage.addAutoPopulateMetadata({
            target: target.constructor,
            propertyKey: propertyKey as string,
            autoPopulateOptions: {
                ref,
                isArray,
            },
        });
    };
}
