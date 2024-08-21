"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDocumentMultipleLanguage = void 0;
const type_metadata_storage_1 = require("../storages/type-metadata.storage");
const createDocumentMultipleLanguage = async (entity, doc, locale, isArrayDocs) => {
    const localeFields = type_metadata_storage_1.TypeMetadataMultipleLanguageStorage.getMultipleLanguageMetadata(entity);
    if (!localeFields.length)
        return;
    const applyMultipleLanguage = (item) => {
        localeFields.forEach(({ propertyKey }) => {
            if (item[propertyKey]) {
                item[propertyKey] = { [locale]: item[propertyKey] };
            }
        });
    };
    if (isArrayDocs) {
        doc.forEach(applyMultipleLanguage);
    }
    else {
        applyMultipleLanguage(doc);
    }
};
exports.createDocumentMultipleLanguage = createDocumentMultipleLanguage;
//# sourceMappingURL=create.utils.js.map