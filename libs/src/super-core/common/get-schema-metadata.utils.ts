import { Type } from '@nestjs/common';
import { TypeMetadataStorage } from '@nestjs/mongoose/dist/storages/type-metadata.storage';

export const getSchemaMetadata = (entity: object | Type<unknown>) => {
    return TypeMetadataStorage.getSchemaMetadataByTarget(
        entity as Type<unknown>,
    );
};
