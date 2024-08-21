/* eslint-disable @typescript-eslint/ban-types */

import { PipelineStage } from 'mongoose';
import { AutoPopulateMetadataStorage } from '../storages/auto-populate-metadata.storage';

export const dynamicLookupAggregates = (target: Function) => {
    const pipelines: PipelineStage[] = [];
    const autoPopulateOptions =
        AutoPopulateMetadataStorage.getAutoPopulateMetadata(target);

    if (!autoPopulateOptions.length) {
        return;
    }

    const lookupStages = autoPopulateOptions.map((option) => {
        const { autoPopulateOptions, propertyKey: fieldName } = option;
        const { ref, isArray } = autoPopulateOptions;

        const lookupStage: PipelineStage[] = [
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
