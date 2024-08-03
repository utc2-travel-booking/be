import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { TypeMetadataMultipleLanguageStorage } from '../storages/type-metadata.storage';

export const updateDocumentMultipleLanguage = async (
    model: Model<any>,
    entity: any,
    filter: FilterQuery<any> | Types.ObjectId,
    update: UpdateQuery<any>,
    locale: string,
) => {
    const localeFields =
        TypeMetadataMultipleLanguageStorage.getMultipleLanguageMetadata(entity);
    if (!localeFields.length) return;

    const filterQuery = Types.ObjectId.isValid(filter as Types.ObjectId)
        ? { _id: new Types.ObjectId(filter.toString()) }
        : filter;

    const document = await model.findOne(filterQuery);
    if (!document) return;

    localeFields.forEach(({ propertyKey }) => {
        if (update[propertyKey]) {
            update[propertyKey] = {
                ...document[propertyKey],
                [locale]: update[propertyKey],
            };
        }
    });
};
