import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export interface ExtendedApiPropertyOptions extends ApiPropertyOptions {
    cms?: {
        ref?: string;
        isShow?: boolean;
        widget?: 'textarea' | 'password';
    };
}

export const ExtendedApiProperty = (options?: ExtendedApiPropertyOptions) => {
    return applyDecorators(ApiProperty(options));
};
