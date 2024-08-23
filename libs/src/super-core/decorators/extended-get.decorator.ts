import { applyDecorators, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { appSettings } from 'src/configs/appsettings';

export interface ExtendedGetOptions {
    route?: string;
}

export const ExtendedGet = (options?: ExtendedGetOptions) => {
    const { route } = options || {};
    return applyDecorators(
        ApiBearerAuth(),
        ApiQuery({
            name: 'locale',
            type: String,
            required: false,
            description: 'Locale of the request',
            example: appSettings.mainLanguage,
        }),
        Get(route),
    );
};
