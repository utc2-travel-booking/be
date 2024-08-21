import { AutoPopulateMetadata } from '../metadata/auto-populate.interface';
export declare class AutoPopulateMetadataStorageHost {
    private properties;
    addAutoPopulateMetadata(metadata: AutoPopulateMetadata): void;
    getAutoPopulateMetadata(target: Function): AutoPopulateMetadata[];
}
export declare const AutoPopulateMetadataStorage: AutoPopulateMetadataStorageHost;
