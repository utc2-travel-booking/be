import { PipelineStage } from 'mongoose';
import { TypeMetadataMultipleLanguageStorage } from '../storages/type-metadata.storage';
import { appSettings } from 'src/configs/app-settings';
import _ from 'lodash';
import { getSchemaMetadata } from '@libs/super-core';

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
            const mapPath = `${prefix}`;
            if (!_.has(addFieldsStage, `$addFields.${mapPath}`)) {
                _.set(addFieldsStage, `$addFields.${mapPath}`, {
                    $map: {
                        input: `$${prefix}`,
                        as: 'item',
                        in: {
                            $mergeObjects: [
                                '$$item',
                                {
                                    [`${propertyKey}`]: {
                                        $ifNull: [
                                            `$$item.${propertyKey}.${locale}`,
                                            `$$item.${propertyKey}.${appSettings.mainLanguage}`,
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                });
            } else {
                const mergeObjectsPath = `$addFields.${mapPath}.$map.in.$mergeObjects`;
                const currentMergeObjects = _.get(
                    addFieldsStage,
                    mergeObjectsPath,
                    [],
                );
                currentMergeObjects.push({
                    [`${propertyKey}`]: {
                        $ifNull: [
                            `$$item.${propertyKey}.${locale}`,
                            `$$item.${propertyKey}.${appSettings.mainLanguage}`,
                        ],
                    },
                });
                _.set(addFieldsStage, mergeObjectsPath, currentMergeObjects);
            }
        } else {
            const _prefix = prefix ? `${prefix}.` : '';
            const fieldPath = `$addFields.${_prefix}${propertyKey}`;
            _.set(addFieldsStage, fieldPath, {
                $ifNull: [
                    `$${_prefix}${propertyKey}.${locale}`,
                    `$${_prefix}${propertyKey}.${appSettings.mainLanguage}`,
                ],
            });
        }
    });
};

const traverseEntityMultipleLanguage = (
    entity: any,
    pipeline: PipelineStage[],
    locale: string,
    prefix = '',
    isArray = false,
    relationLevel = 0,
) => {
    relationLevel++;
    if (relationLevel > 2) return;
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
                `${prefix}${property.propertyKey}`,
                isArray,
                relationLevel,
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
