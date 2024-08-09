import { PipelineStage } from 'mongoose';
import { TypeMetadataMultipleLanguageStorage } from '../storages/type-metadata.storage';
import { TypeMetadataStorage } from '@nestjs/mongoose/dist/storages/type-metadata.storage';

const getSchemaMetadata = (entity: any) => {
    return TypeMetadataStorage.getSchemaMetadataByTarget(entity);
};

const applyMultipleLanguageFields = (
    entity: any,
    addFieldsStage: any,
    locale: string,
    prefix = '',
) => {
    const localeFields =
        TypeMetadataMultipleLanguageStorage.getMultipleLanguageMetadata(entity);

    localeFields.forEach((field) => {
        const { propertyKey } = field;
        addFieldsStage.$addFields[`${prefix}${propertyKey}`] = {
            $ifNull: [`$${prefix}${propertyKey}.${locale}`, 'NO DATA'],
        };
    });
};

const traverseEntityMultipleLanguage = (
    entity: any,
    pipeline: PipelineStage[],
    locale: string,
    prefix = '',
) => {
    const schemaMetadata = getSchemaMetadata(entity);

    if (!schemaMetadata) return;

    const addFieldsStage = {
        $addFields: {},
    };

    applyMultipleLanguageFields(entity, addFieldsStage, locale, prefix);

    if (Object.keys(addFieldsStage.$addFields).length > 0) {
        pipeline.push(addFieldsStage);
    }

    schemaMetadata.properties.forEach((property) => {
        if (property.options['refClass']) {
            const nestedEntity = property.options['refClass'];
            traverseEntityMultipleLanguage(
                nestedEntity,
                pipeline,
                locale,
                `${prefix}${property.propertyKey}.`,
            );
        }
    });
};

export const findDocumentMultipleLanguage = (entity: any, locale?: string) => {
    if (locale) {
        const pipeline: PipelineStage[] = [];
        traverseEntityMultipleLanguage(entity, pipeline, locale);
        return pipeline;
    }
};
