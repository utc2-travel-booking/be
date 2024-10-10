import { applyDecorators, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { appSettings } from 'src/configs/app-settings';

export interface SuperDeleteOptions {
    route?: string;
}

export const SuperDelete = (options?: SuperDeleteOptions) => {
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
        Delete(route),
    );
};
