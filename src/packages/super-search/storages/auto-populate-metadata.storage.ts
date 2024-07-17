/* eslint-disable @typescript-eslint/ban-types */
import { AutoPopulateMetadata } from '../metadata/auto-populate.interface';

export class AutoPopulateMetadataStorageHost {
    private properties = new Array<AutoPopulateMetadata>();

    addAutoPopulateMetadata(metadata: AutoPopulateMetadata) {
        this.properties.unshift(metadata);
    }

    getAutoPopulateMetadata(target: Function): AutoPopulateMetadata[] {
        let metas: AutoPopulateMetadata[] = [];

        metas = this.properties.filter((meta) => meta.target === target);

        let parent = Object.getPrototypeOf(target);
        while (parent && parent !== Function.prototype) {
            metas = metas.concat(
                this.properties.filter((meta) => meta.target === parent),
            );
            parent = Object.getPrototypeOf(parent);
        }

        return metas;
    }
}

const globalRef: {
    AutoPopulateMetadataStorage?: AutoPopulateMetadataStorageHost;
} = global as any;
export const AutoPopulateMetadataStorage =
    globalRef.AutoPopulateMetadataStorage ||
    new AutoPopulateMetadataStorageHost();
globalRef.AutoPopulateMetadataStorage = AutoPopulateMetadataStorage;
