import { SuperCacheService } from '../super-cache.service';
import _ from 'lodash';
import { getSchemaMetadata } from '@libs/super-core';

export const createRedisFolderCollection = async (
    collectionName: string,
    entity: any,
    superCacheService: SuperCacheService,
) => {
    if (await superCacheService.getOneCollection(collectionName)) {
        return;
    }

    const schemaMetadata = getSchemaMetadata(entity);

    if (!schemaMetadata) return;

    const relationCollectionNames = [];
    schemaMetadata.properties.forEach((property) => {
        if (property.options['ref']) {
            relationCollectionNames.push(property.options['ref']);
        }
    });

    await superCacheService.setOneCollection(
        collectionName,
        _.uniq(relationCollectionNames),
    );
};
