import { applyDecorators } from '@nestjs/common';
import { Prop } from '@nestjs/mongoose';
import { SchemaTypeOptions } from 'mongoose';

export class ExtendedPropOptions extends SchemaTypeOptions<any> {
    cms?: {
        label?: string;
        tableShow?: boolean;
        index?: boolean;
        columnPosition?: number;
    };
}

export const ExtendedProp = (options?: ExtendedPropOptions) => {
    return applyDecorators(Prop(options));
};
