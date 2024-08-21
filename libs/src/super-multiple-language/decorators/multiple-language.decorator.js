"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleLanguage = void 0;
const type_metadata_storage_1 = require("../storages/type-metadata.storage");
function MultipleLanguage() {
    return (target, propertyKey) => {
        type_metadata_storage_1.TypeMetadataMultipleLanguageStorage.addMultipleLanguageMetadata({
            target: target.constructor,
            propertyKey: propertyKey,
        });
    };
}
exports.MultipleLanguage = MultipleLanguage;
//# sourceMappingURL=multiple-language.decorator.js.map