import { TypeMetadataMultipleLanguageStorage } from '../storages/type-metadata.storage';

export function MultipleLanguage(): PropertyDecorator {
    return (target: object, propertyKey: string | symbol) => {
        TypeMetadataMultipleLanguageStorage.addMultipleLanguageMetadata({
            target: target.constructor,
            propertyKey: propertyKey as string,
        });
    };
}
