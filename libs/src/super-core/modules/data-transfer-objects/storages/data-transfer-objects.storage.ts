import { DTOMetadata } from '../metadata/data-transfer-objects.interface';

export class DTOMetadataStorageHost {
    private properties = new Array<DTOMetadata>();

    addDTOMetadata(metadata: DTOMetadata) {
        this.properties.unshift(metadata);
    }

    getDTOMetadata(name: string): DTOMetadata {
        return this.properties.find((meta) => meta.name === name);
    }
}

const globalRef: {
    DTOMetadataStorage?: DTOMetadataStorageHost;
} = global as any;
export const DTOMetadataStorage =
    globalRef.DTOMetadataStorage || new DTOMetadataStorageHost();
globalRef.DTOMetadataStorage = DTOMetadataStorage;
