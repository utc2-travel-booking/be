import { DECORATORS } from '@nestjs/swagger/dist/constants';
import { DTOMetadataStorage } from '../storages/data-transfer-objects.storage';
import { DTOMetadataForm } from '../metadata/data-transfer-objects.interface';
import _ from 'lodash';

export const addDtoProperties = (dto: new () => any) => {
    const properties =
        Reflect.getMetadata(
            DECORATORS.API_MODEL_PROPERTIES_ARRAY,
            dto.prototype,
        ) || [];

    const form: DTOMetadataForm = {};
    for (const property of properties) {
        const [, propertyKey] = property.split(':');

        const propertyData = Reflect.getMetadata(
            DECORATORS.API_MODEL_PROPERTIES,
            dto.prototype,
            propertyKey,
        );

        form[propertyKey] = {
            title: _.get(propertyData, 'title', propertyKey),
            type: _.lowerCase(_.get(propertyData, 'type.name', 'String')),
            isArray: _.get(propertyData, 'isArray', false),
            ref: _.get(propertyData, 'cms.ref', null),
            required: _.get(propertyData, 'required', false),
        };
    }

    DTOMetadataStorage.addDTOMetadata({
        name: dto.name,
        form,
    });
};
