import { LocaleMetadata } from '../metadata/locale-metadata.interface';

export class TypeMetadataStorageHost {
    private properties = new Array<LocaleMetadata>();

    addLocaleMetadata(metadata: LocaleMetadata) {
        this.properties.unshift(metadata);
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    getLocaleMetadata(target: Function): LocaleMetadata[] {
        return this.properties.filter((meta) => meta.target === target);
    }
}

const globalRef: { TypeMetadataStorage?: TypeMetadataStorageHost } =
    global as any;
export const TypeMetadataStorage =
    globalRef.TypeMetadataStorage || new TypeMetadataStorageHost();
globalRef.TypeMetadataStorage = TypeMetadataStorage;
