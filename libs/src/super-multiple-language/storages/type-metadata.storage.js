"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeMetadataMultipleLanguageStorage = exports.TypeMetadataMultipleLanguageStorageHost = void 0;
class TypeMetadataMultipleLanguageStorageHost {
    constructor() {
        this.properties = new Array();
    }
    addMultipleLanguageMetadata(metadata) {
        this.properties.unshift(metadata);
    }
    getMultipleLanguageMetadata(target) {
        return this.properties.filter((meta) => meta.target === target);
    }
}
exports.TypeMetadataMultipleLanguageStorageHost = TypeMetadataMultipleLanguageStorageHost;
const globalRef = global;
exports.TypeMetadataMultipleLanguageStorage = globalRef.TypeMetadataMultipleLanguageStorage ||
    new TypeMetadataMultipleLanguageStorageHost();
globalRef.TypeMetadataMultipleLanguageStorage =
    exports.TypeMetadataMultipleLanguageStorage;
//# sourceMappingURL=type-metadata.storage.js.map