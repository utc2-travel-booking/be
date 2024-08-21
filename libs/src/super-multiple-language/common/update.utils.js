"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDocumentMultipleLanguage = void 0;
const mongoose_1 = require("mongoose");
const type_metadata_storage_1 = require("../storages/type-metadata.storage");
const updateDocumentMultipleLanguage = async (model, entity, filter, update, locale) => {
    const localeFields = type_metadata_storage_1.TypeMetadataMultipleLanguageStorage.getMultipleLanguageMetadata(entity);
    if (!localeFields.length)
        return;
    const filterQuery = mongoose_1.Types.ObjectId.isValid(filter)
        ? { _id: new mongoose_1.Types.ObjectId(filter.toString()) }
        : filter;
    const document = await model.findOne(filterQuery);
    if (!document)
        return;
    localeFields.forEach(({ propertyKey }) => {
        if (update[propertyKey]) {
            update[propertyKey] = Object.assign(Object.assign({}, document[propertyKey]), { [locale]: update[propertyKey] });
        }
    });
};
exports.updateDocumentMultipleLanguage = updateDocumentMultipleLanguage;
//# sourceMappingURL=update.utils.js.map