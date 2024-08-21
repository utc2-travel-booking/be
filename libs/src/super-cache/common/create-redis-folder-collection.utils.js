"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisFolderCollection = void 0;
const type_metadata_storage_1 = require("@nestjs/mongoose/dist/storages/type-metadata.storage");
const lodash_1 = __importDefault(require("lodash"));
const createRedisFolderCollection = async (collectionName, entity, superCacheService) => {
    if (await superCacheService.getOneCollection(collectionName)) {
        return;
    }
    const schemaMetadata = type_metadata_storage_1.TypeMetadataStorage.getSchemaMetadataByTarget(entity);
    if (!schemaMetadata)
        return;
    const relationCollectionNames = [];
    schemaMetadata.properties.forEach((property) => {
        if (property.options['ref']) {
            relationCollectionNames.push(property.options['ref']);
        }
    });
    await superCacheService.setOneCollection(collectionName, lodash_1.default.uniq(relationCollectionNames));
};
exports.createRedisFolderCollection = createRedisFolderCollection;
//# sourceMappingURL=create-redis-folder-collection.utils.js.map