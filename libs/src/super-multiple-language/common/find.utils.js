"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDocumentMultipleLanguage = void 0;
const type_metadata_storage_1 = require("../storages/type-metadata.storage");
const type_metadata_storage_2 = require("@nestjs/mongoose/dist/storages/type-metadata.storage");
const appsettings_1 = require("../../../../src/configs/appsettings");
const lodash_1 = __importDefault(require("lodash"));
const getSchemaMetadata = (entity) => {
    return type_metadata_storage_2.TypeMetadataStorage.getSchemaMetadataByTarget(entity);
};
const applyMultipleLanguageFields = (entity, addFieldsStage, locale, prefix = '', isArray = false) => {
    const localeFields = type_metadata_storage_1.TypeMetadataMultipleLanguageStorage.getMultipleLanguageMetadata(entity);
    localeFields.forEach((field) => {
        const { propertyKey } = field;
        if (isArray) {
            const mapPath = `${prefix}`;
            if (!lodash_1.default.has(addFieldsStage, `$addFields.${mapPath}`)) {
                lodash_1.default.set(addFieldsStage, `$addFields.${mapPath}`, {
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
                                            'NO DATA',
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                });
            }
            else {
                const mergeObjectsPath = `$addFields.${mapPath}.$map.in.$mergeObjects`;
                const currentMergeObjects = lodash_1.default.get(addFieldsStage, mergeObjectsPath, []);
                currentMergeObjects.push({
                    [`${propertyKey}`]: {
                        $ifNull: [`$$item.${propertyKey}.${locale}`, 'NO DATA'],
                    },
                });
                lodash_1.default.set(addFieldsStage, mergeObjectsPath, currentMergeObjects);
            }
        }
        else {
            const fieldPath = `$addFields.${prefix}${propertyKey}`;
            lodash_1.default.set(addFieldsStage, fieldPath, {
                $ifNull: [`$${propertyKey}.${locale}`, 'NO DATA'],
            });
        }
    });
};
const traverseEntityMultipleLanguage = (entity, pipeline, locale, prefix = '', isArray = false) => {
    const schemaMetadata = getSchemaMetadata(entity);
    if (!schemaMetadata)
        return;
    const addFieldsStage = {
        $addFields: {},
    };
    applyMultipleLanguageFields(entity, addFieldsStage, locale, prefix, isArray);
    if (Object.keys(addFieldsStage.$addFields).length > 0) {
        pipeline.push(addFieldsStage);
    }
    schemaMetadata.properties.forEach((property) => {
        if (property.options['refClass']) {
            const nestedEntity = property.options['refClass'];
            const isArray = property.options['type'] &&
                Array.isArray(property.options['type']);
            traverseEntityMultipleLanguage(nestedEntity, pipeline, locale, `${prefix}${property.propertyKey}`, isArray);
        }
    });
};
const findDocumentMultipleLanguage = (entity, locale = appsettings_1.appSettings.mainLanguage) => {
    const pipeline = [];
    traverseEntityMultipleLanguage(entity, pipeline, locale);
    return pipeline;
};
exports.findDocumentMultipleLanguage = findDocumentMultipleLanguage;
//# sourceMappingURL=find.utils.js.map