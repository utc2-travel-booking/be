import { Document } from 'mongoose';
import { TypeMetadataStorage } from '../storages/type-metadata.storage';

export const createDocumentLocale = async (
    entity: any,
    doc: Document | Document[],
    locale?: string,
    isArrayDocs?: boolean,
) => {
    const localeFields = TypeMetadataStorage.getLocaleMetadata(entity);

    if (!localeFields.length) return;

    const applyLocale = (item: any) => {
        localeFields.forEach(({ propertyKey }) => {
            if (item[propertyKey]) {
                item[propertyKey] = { [locale]: item[propertyKey] };
            }
        });
    };

    if (isArrayDocs) {
        (doc as Document[]).forEach(applyLocale);
    } else {
        applyLocale(doc);
    }
};
