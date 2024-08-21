import { AutoPopulateOptions } from '../decorators/auto-populate.decorator';
export interface AutoPopulateMetadata {
    target: Function;
    propertyKey: string;
    autoPopulateOptions: AutoPopulateOptions;
}
