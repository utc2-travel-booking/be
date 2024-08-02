import { PipelineStage } from 'mongoose';
import { TypeMetadataStorage } from '../storages/type-metadata.storage';
import { TypeMetadataStorage as TypeMetadataStorageMongoose } from '@nestjs/mongoose/dist/storages/type-metadata.storage';

const getSchemaMetadata = (entity: any) => {
    return TypeMetadataStorageMongoose.getSchemaMetadataByTarget(entity);
};

const applyLocaleFields = (
    entity: any,
    addFieldsStage: any,
    locale: string,
    prefix = '',
) => {
    const localeFields = TypeMetadataStorage.getLocaleMetadata(entity);

    localeFields.forEach((field) => {
        const { propertyKey } = field;
        addFieldsStage.$addFields[`${prefix}${propertyKey}`] = {
            $ifNull: [`$${prefix}${propertyKey}.${locale}`, 'NO DATA'],
        };
    });
};

const traverseEntityLocale = (
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

    applyLocaleFields(entity, addFieldsStage, locale, prefix);

    if (Object.keys(addFieldsStage.$addFields).length > 0) {
        pipeline.push(addFieldsStage);
    }

    schemaMetadata.properties.forEach((property) => {
        if (property.options['relationClass']) {
            const nestedEntity = property.options['relationClass'];
            traverseEntityLocale(
                nestedEntity,
                pipeline,
                locale,
                `${prefix}${property.propertyKey}.`,
            );
        }
    });
};

export const findDocumentLocale = (
    entity: any,
    pipeline: PipelineStage[],
    locale?: string,
) => {
    if (locale) {
        traverseEntityLocale(entity, pipeline, locale);
    }
};
