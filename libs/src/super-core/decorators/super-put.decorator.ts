import { applyDecorators, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { appSettings } from 'src/configs/app-settings';
import { addDtoProperties } from '../modules/data-transfer-objects/common/add-dto-properties.utils';

export interface SuperPutOptions {
    route?: string;
    dto?: new () => any;
}

export const SuperPut = (option?: SuperPutOptions) => {
    const { route, dto } = option || {};

    if (dto) {
        addDtoProperties(dto);
    }

    return applyDecorators(
        ApiBearerAuth(),
        ApiQuery({
            name: 'locale',
            type: String,
            required: false,
            description: 'Locale of the request',
            example: appSettings.mainLanguage,
        }),
        ApiBody({ type: dto }),
        Put(route),
    );
};
