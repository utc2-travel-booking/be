import { MultipleLanguageMetadata } from '../metadata/locale-metadata.interface';
export declare class TypeMetadataMultipleLanguageStorageHost {
    private properties;
    addMultipleLanguageMetadata(metadata: MultipleLanguageMetadata): void;
    getMultipleLanguageMetadata(target: Function): MultipleLanguageMetadata[];
}
export declare const TypeMetadataMultipleLanguageStorage: TypeMetadataMultipleLanguageStorageHost;
