import { MultipleLanguageMetadata } from '../metadata/locale-metadata.interface';

export class TypeMetadataMultipleLanguageStorageHost {
    private properties = new Array<MultipleLanguageMetadata>();

    addMultipleLanguageMetadata(metadata: MultipleLanguageMetadata) {
        this.properties.unshift(metadata);
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    getMultipleLanguageMetadata(target: Function): MultipleLanguageMetadata[] {
        return this.properties.filter((meta) => meta.target === target);
    }
}

const globalRef: {
    TypeMetadataMultipleLanguageStorage?: TypeMetadataMultipleLanguageStorageHost;
} = global as any;
export const TypeMetadataMultipleLanguageStorage =
    globalRef.TypeMetadataMultipleLanguageStorage ||
    new TypeMetadataMultipleLanguageStorageHost();
globalRef.TypeMetadataMultipleLanguageStorage =
    TypeMetadataMultipleLanguageStorage;
