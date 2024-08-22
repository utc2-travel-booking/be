import { addDtoProperties } from '@libs/super-core/modules/data-transfer-objects/common/add-dto-properties.utils';
import { Delete, Get, Post, Put, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { appSettings } from 'src/configs/appsettings';

export const DefaultGet = (route?: string) => {
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

export const DefaultPut = (route?: string) => {
    return applyDecorators(
        ApiBearerAuth(),
        ApiQuery({
            name: 'locale',
            type: String,
            required: false,
            description: 'Locale of the request',
            example: appSettings.mainLanguage,
        }),
        Put(route),
    );
};

export const DefaultDelete = (route?: string) => {
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
