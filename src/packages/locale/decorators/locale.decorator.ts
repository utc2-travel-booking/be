import { TypeMetadataStorage } from '../storages/type-metadata.storage';

export function Locale(): PropertyDecorator {
    return (target: object, propertyKey: string | symbol) => {
        TypeMetadataStorage.addLocaleMetadata({
            target: target.constructor,
            propertyKey: propertyKey as string,
        });
    };
}
