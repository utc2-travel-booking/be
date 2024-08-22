import { AutoPopulateOptions } from '../decorators/auto-populate.decorator';

export interface AutoPopulateMetadata {
    target: object;
    propertyKey: string;
    autoPopulateOptions: AutoPopulateOptions;
}
