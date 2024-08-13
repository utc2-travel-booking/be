import { PipelineStage } from 'mongoose';
import { TypeMetadataMultipleLanguageStorage } from '../storages/type-metadata.storage';
import { TypeMetadataStorage } from '@nestjs/mongoose/dist/storages/type-metadata.storage';
import { appSettings } from 'src/configs/appsettings';

const getSchemaMetadata = (entity: any) => {
    return TypeMetadataStorage.getSchemaMetadataByTarget(entity);
};

const applyMultipleLanguageFields = (
    entity: any,
    addFieldsStage: any,
    locale: string,
    prefix = '',
    isArray = false,
) => {
    const localeFields =
        TypeMetadataMultipleLanguageStorage.getMultipleLanguageMetadata(entity);

    localeFields.forEach((field) => {
        const { propertyKey } = field;

        if (isArray) {
            addFieldsStage.$addFields[`${prefix}${propertyKey}`] = {
                $arrayElemAt: [
                    {
                        $map: {
                            input: `$${prefix}${propertyKey}`,
                            as: 'item',
                            in: {
                                $ifNull: [`$$item.${locale}`, 'NO DATA'],
                            },
                        },
                    },
                    0,
                ],
            };
        } else {
            addFieldsStage.$addFields[`${prefix}${propertyKey}`] = {
                $ifNull: [`$${prefix}${propertyKey}.${locale}`, 'NO DATA'],
            };
        }
    });
};

const traverseEntityMultipleLanguage = (
    entity: any,
    pipeline: PipelineStage[],
    locale: string,
    prefix = '',
    isArray = false,
) => {
    const schemaMetadata = getSchemaMetadata(entity);

    if (!schemaMetadata) return;

    const addFieldsStage = {
        $addFields: {},
    };

    applyMultipleLanguageFields(
        entity,
        addFieldsStage,
        locale,
        prefix,
        isArray,
    );

    if (Object.keys(addFieldsStage.$addFields).length > 0) {
        pipeline.push(addFieldsStage);
    }

    schemaMetadata.properties.forEach((property) => {
        if (property.options['refClass']) {
            const nestedEntity = property.options['refClass'];
            const isArray =
                property.options['type'] &&
                Array.isArray(property.options['type']);

            traverseEntityMultipleLanguage(
                nestedEntity,
                pipeline,
                locale,
                `${prefix}${property.propertyKey}.`,
                isArray,
            );
        }
    });
};

export const findDocumentMultipleLanguage = (
    entity: any,
    locale = appSettings.mainLanguage,
) => {
    const pipeline: PipelineStage[] = [];
    traverseEntityMultipleLanguage(entity, pipeline, locale);
    return pipeline;
};
