import { TypeMetadataStorage } from '@nestjs/mongoose/dist/storages/type-metadata.storage';
import { SuperCacheService } from '../super-cache.service';
import _ from 'lodash';

export const createRedisFolderCollection = async (
    collectionName: string,
    entity: any,
    superCacheService: SuperCacheService,
) => {
    if (await superCacheService.getOneCollection(collectionName)) {
        return;
    }

    const schemaMetadata =
        TypeMetadataStorage.getSchemaMetadataByTarget(entity);

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
