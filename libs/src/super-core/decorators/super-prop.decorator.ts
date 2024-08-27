import { applyDecorators } from '@nestjs/common';
import { Prop } from '@nestjs/mongoose';
import { SchemaTypeOptions } from 'mongoose';

export class SuperPropOptions extends SchemaTypeOptions<any> {
    cms?: {
        label?: string;
        tableShow?: boolean;
        index?: boolean;
        columnPosition?: number;
    };
}

export const SuperProp = (options?: SuperPropOptions) => {
    return applyDecorators(Prop(options));
};
