import { applyDecorators, Post } from '@nestjs/common';
import { addDtoProperties } from '../modules/data-transfer-objects/common/add-dto-properties.utils';
import { ApiBearerAuth, ApiBody, ApiQuery } from '@nestjs/swagger';
import { appSettings } from 'src/configs/appsettings';

export interface ExtendedPostOptions {
    route?: string;
    dto?: new () => any;
}

export const ExtendedPost = (option?: ExtendedPostOptions) => {
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
        Post(route),
    );
};
