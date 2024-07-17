import { FilterQuery, Model, UpdateQuery } from 'mongoose';
import { TypeMetadataStorage } from '../storages/type-metadata.storage';

export const updateDocumentLocale = async (
    model: Model<any>,
    entity: any,
    filter?: FilterQuery<any>,
    update?: UpdateQuery<any>,
    locale?: string,
) => {
    const localeFields = TypeMetadataStorage.getLocaleMetadata(entity);

    if (!localeFields.length) {
        return;
    }

    const document = await model.findOne(filter);

    if (!document) {
        return;
    }

    localeFields.forEach((field) => {
        const { propertyKey } = field;
        if (update[propertyKey]) {
            update[propertyKey] = {
                ...document[propertyKey],
                [locale]: update[propertyKey],
            };
        }
    });
};
