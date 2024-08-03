import { Document } from 'mongoose';
import { TypeMetadataMultipleLanguageStorage } from '../storages/type-metadata.storage';

export const createDocumentMultipleLanguage = async (
    entity: any,
    doc: Document | Document[],
    locale?: string,
    isArrayDocs?: boolean,
) => {
    const localeFields =
        TypeMetadataMultipleLanguageStorage.getMultipleLanguageMetadata(entity);

    if (!localeFields.length) return;

    const applyMultipleLanguage = (item: any) => {
        localeFields.forEach(({ propertyKey }) => {
            if (item[propertyKey]) {
                item[propertyKey] = { [locale]: item[propertyKey] };
            }
        });
    };

    if (isArrayDocs) {
        (doc as Document[]).forEach(applyMultipleLanguage);
    } else {
        applyMultipleLanguage(doc);
    }
};
