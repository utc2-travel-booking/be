import { PipelineStage } from 'mongoose';
import { TypeMetadataStorage } from '../storages/type-metadata.storage';

export const findDocumentLocale = (
    entity: any,
    pipeline: PipelineStage[],
    locale?: string,
) => {
    const localeFields = TypeMetadataStorage.getLocaleMetadata(entity);

    if (localeFields.length) {
        const addFieldsStage = {
            $addFields: {},
        };

        localeFields.forEach((field) => {
            const { propertyKey } = field;
            addFieldsStage.$addFields[propertyKey] = {
                $ifNull: [`$${propertyKey}.${locale}`, 'NO DATA'],
            };
        });

        pipeline.push(addFieldsStage);
    }
};
