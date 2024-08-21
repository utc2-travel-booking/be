"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dynamicLookupAggregates = void 0;
const auto_populate_metadata_storage_1 = require("../storages/auto-populate-metadata.storage");
const dynamicLookupAggregates = (target) => {
    const pipelines = [];
    const autoPopulateOptions = auto_populate_metadata_storage_1.AutoPopulateMetadataStorage.getAutoPopulateMetadata(target);
    if (!autoPopulateOptions.length) {
        return;
    }
    const lookupStages = autoPopulateOptions.map((option) => {
        const { autoPopulateOptions, propertyKey: fieldName } = option;
        const { ref, isArray } = autoPopulateOptions;
        const lookupStage = [
            {
                $lookup: {
                    from: ref,
                    localField: fieldName,
                    foreignField: '_id',
                    as: fieldName,
                },
            },
        ];
        if (!isArray) {
            lookupStage.push({
                $unwind: {
                    path: `$${fieldName}`,
                    preserveNullAndEmptyArrays: true,
                },
            });
        }
        return lookupStage;
    });
    pipelines.push(...lookupStages.flat());
    return pipelines;
};
exports.dynamicLookupAggregates = dynamicLookupAggregates;
//# sourceMappingURL=dynamic-lookups.aggregates.js.map