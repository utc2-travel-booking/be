import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

export interface SuperApiPropertyOptions extends ApiPropertyOptions {
    cms?: {
        ref?: string;
        isShow?: boolean;
        widget?: 'textarea' | 'password' | 'textEditor';
    };
}

export const SuperApiProperty = (options?: SuperApiPropertyOptions) => {
    return applyDecorators(ApiProperty(options));
};
