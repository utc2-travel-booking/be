import { applyDecorators, Delete } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { appSettings } from 'src/configs/appsettings';

export interface ExtendedDeleteOptions {
    route?: string;
}

export const ExtendedDelete = (options?: ExtendedDeleteOptions) => {
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
