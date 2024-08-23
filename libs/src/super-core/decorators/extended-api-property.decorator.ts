import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export interface ExtendedApiPropertyOptions extends ApiPropertyOptions {
    cms?: {
        ref?: string;
    };
}

export const ExtendedApiDecorator = (options?: ExtendedApiPropertyOptions) => {
    return applyDecorators(ApiProperty(options));
};
