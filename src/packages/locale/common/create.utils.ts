import { Document } from 'mongoose';
import { TypeMetadataStorage } from '../storages/type-metadata.storage';

export const createDocumentLocale = async (
    entity: any,
    doc: Document,
    locale?: string,
) => {
    const localeFields = TypeMetadataStorage.getLocaleMetadata(entity);

    if (localeFields.length) {
        localeFields.forEach((field) => {
            const { propertyKey } = field;
            if (doc[propertyKey]) {
                doc[propertyKey] = {
                    [locale]: doc[propertyKey],
                };
            }
        });
    }
};
